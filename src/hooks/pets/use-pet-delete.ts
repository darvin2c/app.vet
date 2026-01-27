import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'

export function useDeletePet() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (id: string) => {
      if (!currentTenant?.id) throw new Error('No tenant selected')

      const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', id)
        .eq('tenant_id', currentTenant.id)

      if (error) {
        throw new Error(`Error al eliminar mascota: ${error.message}`)
      }

      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] })
      toast.success('Mascota eliminada exitosamente')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
