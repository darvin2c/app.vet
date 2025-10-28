import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UpdateOrderItemSchema } from '@/schemas/order-items.schema'
import { TablesUpdate } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'
import { useTenantDetail } from '../tenants/use-tenant-detail'

export default function useOrderItemUpdate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()
  const { data: tenant } = useTenantDetail()

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

      // Obtener tax rate del tenant
      const tenantTaxRate = tenant?.tax || 0

      // Calcular el total del item si se proporcionan los valores necesarios
      let total: number | undefined
      if (data.quantity !== undefined && data.unit_price !== undefined) {
        const subtotal = data.quantity * data.unit_price
        const discountAmount = (subtotal * (data.discount || 0)) / 100
        const taxableAmount = subtotal - discountAmount
        const taxAmount = (taxableAmount * tenantTaxRate) / 100
        total = taxableAmount + taxAmount
      }

      const orderItemData: TablesUpdate<'order_items'> = {
        product_id: data.product_id,
        description: data.description,
        quantity: data.quantity,
        unit_price: data.unit_price,
        discount: data.discount,
        total: total,
        price_base: data.unit_price,
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
