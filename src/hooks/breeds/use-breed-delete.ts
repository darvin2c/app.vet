import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'

export function useBreedDelete() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (id: string) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const { error } = await supabase
        .from('breeds')
        .delete()
        .eq('id', id)
        .eq('tenant_id', currentTenant.id)

      if (error) {
        throw new Error(`Error al eliminar raza: ${error.message}`)
      }

      return id
    },
    onSuccess: (result) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'breeds'],
      })
      toast.success('Raza eliminada exitosamente')
    },
    onError: (error) => {
      console.error('Error al eliminar raza:', error)
      toast.error('Error al eliminar raza', {
        description: error.message,
      })
    },
  })
}
