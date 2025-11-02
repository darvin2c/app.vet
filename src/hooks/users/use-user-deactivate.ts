import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'

interface DeactivateUserParams {
  userId: string
}

export function useUserDeactivate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async ({ userId }: DeactivateUserParams) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const { error } = await supabase
        .from('tenant_users')
        .update({ is_active: false })
        .eq('tenant_id', currentTenant.id)
        .eq('user_id', userId)

      if (error) {
        throw new Error(`Error al desactivar usuario: ${error.message}`)
      }
    },
    onSuccess: () => {
      // Invalidar cache de usuarios
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'users'],
      })
      toast.success('Usuario desactivado correctamente')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al desactivar usuario')
    },
  })
}

export default useUserDeactivate
