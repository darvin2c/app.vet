import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  UpdateOrderSchema,
  calculateBalance,
  getOrderStatusFromPayment,
} from '@/schemas/orders.schema'
import { TablesUpdate } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'

export default function useOrderUpdate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: Omit<UpdateOrderSchema, 'id'>
    }) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      // Calcular balance usando la función del schema si se proporcionan total y paid_amount
      let balance: number | undefined
      if (data.total !== undefined && data.paid_amount !== undefined) {
        balance = calculateBalance(data.total, data.paid_amount)
      }

      // Determinar el estado basado en el pago si no se proporciona pero hay datos de pago
      let status = data.status
      if (
        !status &&
        data.total !== undefined &&
        data.paid_amount !== undefined
      ) {
        status = getOrderStatusFromPayment(data.paid_amount, data.total)
      }

      const orderData: TablesUpdate<'orders'> = {
        custumer_id: data.custumer_id,
        order_number: data.order_number,
        status: status,
        subtotal: data.subtotal,
        tax: data.tax,
        total: data.total,
        paid_amount: data.paid_amount,
        balance: balance,
        notes: data.notes,
        updated_at: new Date().toISOString(),
      }

      const { data: order, error } = await supabase
        .from('orders')
        .update(orderData)
        .eq('id', id)
        .eq('tenant_id', currentTenant.id)
        .select()
        .single()

      if (error) {
        throw new Error(`Error al actualizar orden: ${error.message}`)
      }

      return order
    },
    onSuccess: () => {
      // Invalidar las consultas relacionadas
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'orders'],
      })
      toast.success('Orden actualizada exitosamente')
    },
    onError: (error) => {
      toast.error(error.message || 'Error al actualizar orden')
    },
  })
}
