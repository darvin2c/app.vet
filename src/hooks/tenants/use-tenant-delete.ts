import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import useCurrentTenantStore from './use-current-tenant-store'

export function useTenantDelete() {
  const queryClient = useQueryClient()
  const { currentTenant, setCurrentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (confirmationText: string) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      // Validate confirmation text
      const expectedText = currentTenant.name
      if (confirmationText !== expectedText) {
        throw new Error(
          `Debes escribir exactamente "${expectedText}" para confirmar la eliminación`
        )
      }

      // First, we need to delete all related data
      // This is a critical operation that should be handled carefully
      // In a real application, this might be handled by a stored procedure or backend service

      // For now, we'll just mark the tenant as inactive instead of hard delete
      const { data: updatedTenant, error } = await supabase
        .from('tenants')
        .update({
          is_active: false,
          updated_at: new Date().toISOString(),
          updated_by: currentTenant.id,
        })
        .eq('id', currentTenant.id)
        .select()
        .single()

      if (error) {
        throw error
      }

      return updatedTenant
    },
    onSuccess: () => {
      // Clear current tenant from store
      setCurrentTenant(null)

      // Invalidate all queries
      queryClient.clear()

      toast.success('Tenant eliminado correctamente')

      // Redirect to tenant selection or home page
      // This should be handled by the component calling this hook
    },
    onError: (error) => {
      console.error('Error deleting tenant:', error)
      toast.error(error.message || 'Error al eliminar el tenant')
    },
  })
}
