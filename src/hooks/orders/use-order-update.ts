import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TablesUpdate } from '@/types/supabase.types'
import { supabase } from '@/lib/supabase/client'
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
      data: Omit<TablesUpdate<'orders'>, 'tenant_id'>
    }) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const orderData: TablesUpdate<'orders'> = {
        customer_id: data.customer_id,
        order_number: data.order_number,
        subtotal: data.subtotal,
        tax: data.tax,
        total: data.total,
        paid_amount: data.paid_amount,
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
