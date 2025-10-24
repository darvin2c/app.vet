import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'

export default function useOrderItemDelete() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (id: string) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      // Obtener el order_id antes de eliminar para invalidar las consultas
      const { data: orderItem } = await supabase
        .from('order_items')
        .select('order_id')
        .eq('id', id)
        .eq('tenant_id', currentTenant.id)
        .single()

      const { error } = await supabase
        .from('order_items')
        .delete()
        .eq('id', id)
        .eq('tenant_id', currentTenant.id)

      if (error) {
        throw new Error(`Error al eliminar item de orden: ${error.message}`)
      }

      return { id, orderId: orderItem?.order_id }
    },
    onSuccess: (data) => {
      // Invalidar las consultas relacionadas
      if (data.orderId) {
        queryClient.invalidateQueries({
          queryKey: [currentTenant?.id, 'order-items', data.orderId],
        })
      }
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'orders'],
      })
      toast.success('Item eliminado exitosamente')
    },
    onError: (error) => {
      toast.error(error.message || 'Error al eliminar item')
    },
  })
}
