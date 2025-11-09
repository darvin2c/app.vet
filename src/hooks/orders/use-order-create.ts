import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TablesInsert } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'

type CreateOrderSchema = {
  order: Omit<TablesInsert<'orders'>, 'tenant_id'>
  items: Omit<TablesInsert<'order_items'>, 'tenant_id' | 'order_id'>[]
  payments: Omit<TablesInsert<'payments'>, 'tenant_id' | 'order_id'>[]
}

export default function useOrderCreate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data: CreateOrderSchema) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const { order, items, payments } = data

      const orderData: TablesInsert<'orders'> = {
        ...order,
        tenant_id: currentTenant.id,
      }
      const { data: createdOrder, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single()

      if (error) {
        throw new Error(`Error al crear orden: ${error.message}`)
      }

      // Insertar los ítems de la orden
      const orderItems: TablesInsert<'order_items'>[] = items.map((item) => ({
        ...item,
        order_id: createdOrder.id,
        tenant_id: currentTenant?.id,
      }))
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        // Eliminar la orden si hay error en los ítems
        await supabase.from('orders').delete().eq('id', createdOrder.id)
        throw new Error(
          `Error al crear ítems de la orden: ${itemsError.message}`
        )
      }

      // Insertar los pagos de la orden
      const paymentsData: TablesInsert<'payments'>[] = payments.map(
        (payment) => ({
          ...payment,
          order_id: createdOrder.id,
          tenant_id: currentTenant?.id,
        })
      )
      const { error: paymentsError } = await supabase
        .from('payments')
        .insert(paymentsData)

      if (paymentsError) {
        // Eliminar la orden si hay error en los pagos
        await supabase.from('orders').delete().eq('id', createdOrder.id)
        throw new Error(
          `Error al crear pagos de la orden: ${paymentsError.message}`
        )
      }

      return createdOrder
    },
    onSuccess: () => {
      // Invalidar las consultas relacionadas
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'orders'],
      })
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'payments'],
      })
      toast.success('Orden creada exitosamente')
    },
    onError: (error) => {
      toast.error(error.message || 'Error al crear orden')
    },
  })
}
