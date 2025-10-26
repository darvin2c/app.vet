import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateOrderSchema, calculateBalance, getOrderStatusFromPayment } from '@/schemas/orders.schema'
import { TablesInsert } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'

export default function useOrderCreate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data: CreateOrderSchema) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      // Generar número de orden automático si no se proporciona
      const orderNumber = data.order_number || `ORD-${Date.now()}`

      // Calcular balance usando la función del schema
      const balance = calculateBalance(data.total, data.paid_amount)

      // Determinar el estado basado en el pago si no se proporciona
      const status = data.status || getOrderStatusFromPayment(data.paid_amount, data.total)

      const orderData: TablesInsert<'orders'> = {
        custumer_id: data.custumer_id,
        order_number: orderNumber,
        status: status,
        subtotal: data.subtotal,
        tax: data.tax,
        total: data.total,
        paid_amount: data.paid_amount,
        balance: balance,
        notes: data.notes,
        tenant_id: currentTenant.id,
      }

      const { data: order, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single()

      if (error) {
        throw new Error(`Error al crear orden: ${error.message}`)
      }

      return order
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
