import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'

export function useRoleDelete() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (id: string) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', id)
        .eq('tenant_id', currentTenant.id)

      if (error) {
        throw new Error(`Error al eliminar rol: ${error.message}`)
      }

      return id
    },
    onSuccess: () => {
      // Invalidar las consultas relacionadas
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'roles'],
      })
      toast.success('Rol eliminado exitosamente')
    },
    onError: (error) => {
      toast.error(error.message || 'Error al eliminar rol')
    },
  })
}
