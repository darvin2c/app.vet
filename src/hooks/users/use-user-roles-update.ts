import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

export function useUserRoleUpdate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async ({
      userId,
      roleId,
    }: {
      userId: string
      roleId: string | null
    }) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const { error } = await supabase
        .from('tenant_users')
        .update({ role_id: roleId })
        .eq('user_id', userId)
        .eq('tenant_id', currentTenant.id)

      if (error) {
        throw new Error(`Error al actualizar rol: ${error.message}`)
      }
    },
    onSuccess: () => {
      toast.success('Rol actualizado correctamente')
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'users'],
      })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useUserStatusToggle() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async ({
      userId,
      isActive,
    }: {
      userId: string
      isActive: boolean
    }) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const { error } = await supabase
        .from('tenant_users')
        .update({ is_active: isActive })
        .eq('user_id', userId)
        .eq('tenant_id', currentTenant.id)

      if (error) {
        throw new Error(`Error al actualizar estado: ${error.message}`)
      }
    },
    onSuccess: (_, { isActive }) => {
      toast.success(isActive ? 'Usuario activado' : 'Usuario desactivado')
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'users'],
      })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
