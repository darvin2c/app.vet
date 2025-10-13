import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

export function useSpeciesDelete() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (id: string) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      // Verificar si hay razas asociadas
      const { data: breeds, error: breedsError } = await supabase
        .from('breeds')
        .select('id')
        .eq('species_id', id)
        .eq('tenant_id', currentTenant.id)
        .limit(1)

      if (breedsError) {
        throw new Error(`Error al verificar razas: ${breedsError.message}`)
      }

      if (breeds && breeds.length > 0) {
        throw new Error(
          'No se puede eliminar la especie porque tiene razas asociadas'
        )
      }

      const { error } = await supabase
        .from('species')
        .delete()
        .eq('id', id)
        .eq('tenant_id', currentTenant.id)

      if (error) {
        throw new Error(`Error al eliminar especie: ${error.message}`)
      }

      return id
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'species'],
      })
    },
  })
}
