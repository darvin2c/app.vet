import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TablesUpdate } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'

export function useRoleUpdate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: Omit<TablesUpdate<'roles'>, 'tenant_id'>
    }) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const { data: role, error } = await supabase
        .from('roles')
        .update(data)
        .eq('id', id)
        .eq('tenant_id', currentTenant.id)
        .select()
        .single()

      if (error) {
        throw new Error(`Error al actualizar rol: ${error.message}`)
      }

      return role
    },
    onSuccess: () => {
      // Invalidar las consultas relacionadas
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'roles'],
      })
      toast.success('Rol actualizado exitosamente')
    },
    onError: (error) => {
      toast.error(error.message || 'Error al actualizar rol')
    },
  })
}
