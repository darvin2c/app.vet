import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { TablesInsert } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { SpeciesCreate } from '@/schemas/species.schema'

export function useSpeciesCreate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data: SpeciesCreate) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const speciesData: TablesInsert<'species'> = {
        ...data,
        tenant_id: currentTenant.id,
      }

      const { data: species, error } = await supabase
        .from('species')
        .insert(speciesData)
        .select()
        .single()

      if (error) {
        throw new Error(`Error al crear especie: ${error.message}`)
      }

      return species
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'species'],
      })
    },
  })
}
