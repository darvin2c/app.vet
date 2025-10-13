import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { Tables } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

interface UseBreedsParams {
  species_id?: string
  search?: string
  is_active?: boolean
}

export function useBreedsList(params?: UseBreedsParams) {
  const { currentTenant } = useCurrentTenantStore()
  const { species_id, search, is_active = true } = params || {}

  return useQuery({
    queryKey: [currentTenant?.id, 'breeds', species_id, search, is_active],
    queryFn: async () => {
      if (!currentTenant?.id) {
        return []
      }

      let query = supabase
        .from('breeds')
        .select(
          `
          *,
          species (
            id,
            name
          )
        `
        )
        .eq('tenant_id', currentTenant.id)
        .eq('is_active', is_active)
        .order('name')

      if (species_id) {
        query = query.eq('species_id', species_id)
      }

      if (search) {
        query = query.ilike('name', `%${search}%`)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Error al obtener razas: ${error.message}`)
      }

      return data as (Tables<'breeds'> & {
        species: Tables<'species'> | null
      })[]
    },
    enabled: !!currentTenant?.id,
  })
}
