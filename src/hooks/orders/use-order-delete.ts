import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'

export default function useOrderDelete() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (id: string) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      // Primero eliminar los items de la orden
      const { error: itemsError } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', id)
        .eq('tenant_id', currentTenant.id)

      if (itemsError) {
        throw new Error(
          `Error al eliminar items de la orden: ${itemsError.message}`
        )
      }

      // Luego eliminar la orden
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id)
        .eq('tenant_id', currentTenant.id)

      if (error) {
        throw new Error(`Error al eliminar orden: ${error.message}`)
      }

      return { id }
    },
    onSuccess: () => {
      // Invalidar las consultas relacionadas
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'orders'],
      })
      toast.success('Orden eliminada exitosamente')
    },
    onError: (error) => {
      toast.error(error.message || 'Error al eliminar orden')
    },
  })
}
