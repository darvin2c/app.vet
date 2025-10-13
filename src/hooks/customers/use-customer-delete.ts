import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

export default function useCustomerDelete() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (id: string) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id)
        .eq('tenant_id', currentTenant.id)

      if (error) {
        throw new Error(`Error al eliminar cliente: ${error.message}`)
      }

      return id
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: [currentTenant?.id, 'customers'] })

      toast.success('Cliente eliminado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al eliminar cliente', {
        description: error.message,
      })
    },
  })
}