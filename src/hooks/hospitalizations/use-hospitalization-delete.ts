import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

export function useDeleteHospitalization() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (id: string) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const { error } = await supabase
        .from('hospitalizations')
        .delete()
        .eq('id', id)
        .eq('tenant_id', currentTenant.id)

      if (error) {
        throw new Error(`Error al eliminar hospitalización: ${error.message}`)
      }

      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'hospitalizations'],
      })
      toast.success('Hospitalización eliminada exitosamente')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
