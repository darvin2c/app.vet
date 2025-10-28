import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateOrderItemSchema } from '@/schemas/order-items.schema'
import { TablesInsert } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'
import { useTenantDetail } from '../tenants/use-tenant-detail'

export default function useOrderItemCreate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()
  const { data: tenant } = useTenantDetail()

  return useMutation({
    mutationFn: async (data: CreateOrderItemSchema) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      if (!data.product_id) {
        throw new Error('Product ID es requerido')
      }

      // Obtener tax rate del tenant
      const tenantTaxRate = tenant?.tax || 0

      // Calcular el total del item
      const subtotal = data.quantity * data.unit_price
      const discountAmount = (subtotal * (data.discount || 0)) / 100
      const taxableAmount = subtotal - discountAmount
      const taxAmount = (taxableAmount * tenantTaxRate) / 100
      const total = taxableAmount + taxAmount

      const orderItemData: TablesInsert<'order_items'> = {
        order_id: data.order_id,
        product_id: data.product_id,
        description: data.description,
        quantity: data.quantity,
        unit_price: data.unit_price,
        discount: data.discount || 0,
        total: total,
        price_base: data.unit_price,
      }

      const { data: orderItem, error } = await supabase
        .from('order_items')
        .insert(orderItemData)
        .select()
        .single()

      if (error) {
        throw new Error(`Error al crear item de orden: ${error.message}`)
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
      toast.success('Item agregado exitosamente')
    },
    onError: (error) => {
      toast.error(error.message || 'Error al agregar item')
    },
  })
}
