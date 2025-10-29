import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getOrderStatusFromPayment } from '@/schemas/orders.schema'
import { TablesInsert } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'

type CreateOrderSchema = {
  order: Omit<TablesInsert<'orders'>, 'tenant_id' | 'balance'>
  items: TablesInsert<'order_items'>[]
  payments: TablesInsert<'payments'>[]
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

      // Determinar el estado basado en el pago si no se proporciona
      const status =
        order.status ||
        getOrderStatusFromPayment(order.paid_amount || 0, order.total || 0)

      const orderData: TablesInsert<'orders'> = {
        ...order,
        status: status,
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
      items.forEach((item) => {
        item.order_id = createdOrder.id
      })
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(items)

      if (itemsError) {
        throw new Error(
          `Error al crear ítems de la orden: ${itemsError.message}`
        )
      }

      // Insertar los pagos de la orden
      payments.forEach((payment) => {
        payment.order_id = createdOrder.id
      })
      const { error: paymentsError } = await supabase
        .from('payments')
        .insert(payments)

      if (paymentsError) {
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
      toast.success('Orden creada exitosamente')
    },
    onError: (error) => {
      toast.error(error.message || 'Error al crear orden')
    },
  })
}
