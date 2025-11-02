import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'

interface ActivateUserParams {
  userId: string
}

export function useUserActivate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async ({ userId }: ActivateUserParams) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const { error } = await supabase
        .from('tenant_users')
        .update({ is_active: true })
        .eq('tenant_id', currentTenant.id)
        .eq('user_id', userId)

      if (error) {
        throw new Error(`Error al activar usuario: ${error.message}`)
      }
    },
    onSuccess: () => {
      // Invalidar cache de usuarios
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'users'],
      })
      toast.success('Usuario activado correctamente')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al activar usuario')
    },
  })
}

export default useUserActivate
