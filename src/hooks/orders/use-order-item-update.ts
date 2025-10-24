import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UpdateOrderItemSchema } from '@/schemas/order-items.schema'
import { TablesUpdate } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'

export default function useOrderItemUpdate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: Omit<UpdateOrderItemSchema, 'id'>
    }) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      // Calcular el total del item si se proporcionan los valores necesarios
      let total: number | undefined
      if (data.quantity !== undefined && data.unit_price !== undefined) {
        const subtotal = data.quantity * data.unit_price
        const discountAmount = (subtotal * (data.discount || 0)) / 100
        const taxableAmount = subtotal - discountAmount
        const taxAmount = (taxableAmount * (data.tax_rate || 0)) / 100
        total = taxableAmount + taxAmount
      }

      const orderItemData: TablesUpdate<'order_items'> = {
        product_id: data.product_id,
        description: data.description,
        quantity: data.quantity,
        unit_price: data.unit_price,
        discount: data.discount,
        tax_rate: data.tax_rate,
        total: total,
      }

      const { data: orderItem, error } = await supabase
        .from('order_items')
        .update(orderItemData)
        .eq('id', id)
        .eq('tenant_id', currentTenant.id)
        .select()
        .single()

      if (error) {
        throw new Error(`Error al actualizar item de orden: ${error.message}`)
      }

      return orderItem
    },
    onSuccess: (data) => {
      // Invalidar las consultas relacionadas
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'order-items', data.order_id],
      })
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'orders'],
      })
      toast.success('Item actualizado exitosamente')
    },
    onError: (error) => {
      toast.error(error.message || 'Error al actualizar item')
    },
  })
}
