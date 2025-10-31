import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TablesInsert } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'

export function useRoleCreate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data: Omit<TablesInsert<'roles'>, 'tenant_id'>) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const roleData: TablesInsert<'roles'> = {
        ...data,
        tenant_id: currentTenant.id,
      }

      const { data: role, error } = await supabase
        .from('roles')
        .insert(roleData)
        .select()
        .single()

      if (error) {
        throw new Error(`Error al crear rol: ${error.message}`)
      }

      return role
    },
    onSuccess: () => {
      // Invalidar las consultas relacionadas
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'roles'],
      })
      toast.success('Rol creado exitosamente')
    },
    onError: (error) => {
      toast.error(error.message || 'Error al crear rol')
    },
  })
}
