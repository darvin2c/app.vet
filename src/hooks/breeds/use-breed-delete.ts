import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

export function useBreedDelete() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (id: string) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      // Verificar si hay mascotas asociadas
      const { data: pets, error: petsError } = await supabase
        .from('pets')
        .select('id')
        .eq('breed_id', id)
        .eq('tenant_id', currentTenant.id)
        .limit(1)

      if (petsError) {
        throw new Error(`Error al verificar mascotas: ${petsError.message}`)
      }

      if (pets && pets.length > 0) {
        throw new Error(
          'No se puede eliminar la raza porque tiene mascotas asociadas'
        )
      }

      // Obtener la raza antes de eliminarla para invalidar queries específicas
      const { data: breed, error: breedError } = await supabase
        .from('breeds')
        .select('species_id')
        .eq('id', id)
        .eq('tenant_id', currentTenant.id)
        .single()

      if (breedError) {
        throw new Error(`Error al obtener raza: ${breedError.message}`)
      }

      const { error } = await supabase
        .from('breeds')
        .delete()
        .eq('id', id)
        .eq('tenant_id', currentTenant.id)

      if (error) {
        throw new Error(`Error al eliminar raza: ${error.message}`)
      }

      return { id, species_id: breed.species_id }
    },
    onSuccess: (result) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'breeds'],
      })
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'breeds', result.species_id],
      })
    },
  })
}
