import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { TablesInsert } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { BreedCreate } from '@/schemas/breeds.schema'

export function useBreedCreate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data: BreedCreate) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const breedData: TablesInsert<'breeds'> = {
        ...data,
        tenant_id: currentTenant.id,
      }

      const { data: breed, error } = await supabase
        .from('breeds')
        .insert(breedData)
        .select()
        .single()

      if (error) {
        throw new Error(`Error al crear raza: ${error.message}`)
      }

      return breed
    },
    onSuccess: (breed) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'breeds'],
      })
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'breeds', breed.species_id],
      })
    },
  })
}
