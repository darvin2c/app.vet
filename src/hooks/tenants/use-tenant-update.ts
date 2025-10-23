import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { TablesUpdate } from '@/types/supabase.types'
import { toast } from 'sonner'
import useCurrentTenantStore from './use-current-tenant-store'

export function useTenantUpdate() {
  const queryClient = useQueryClient()
  const { currentTenant, setCurrentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (
      data: Omit<TablesUpdate<'tenants'>, 'updated_at' | 'updated_by'>
    ) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const updateData: TablesUpdate<'tenants'> = {
        ...data,
        updated_at: new Date().toISOString(),
        updated_by: currentTenant.id, // Assuming current user is updating
      }

      const { data: updatedTenant, error } = await supabase
        .from('tenants')
        .update(updateData)
        .eq('id', currentTenant.id)
        .select()
        .single()

      if (error) {
        throw error
      }

      return updatedTenant
    },
    onSuccess: (updatedTenant) => {
      // Update the current tenant in the store
      setCurrentTenant(updatedTenant)

      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'tenant-detail'],
      })
      queryClient.invalidateQueries({
        queryKey: ['tenants'],
      })

      toast.success('Configuración del tenant actualizada correctamente')
    },
    onError: (error) => {
      console.error('Error updating tenant:', error)
      toast.error('Error al actualizar la configuración del tenant')
    },
  })
}
