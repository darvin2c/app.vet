import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { Tables } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

interface UseSpeciesParams {
  search?: string
  is_active?: boolean
}

export function useSpeciesList(params?: UseSpeciesParams) {
  const { currentTenant } = useCurrentTenantStore()
  const { search, is_active = true } = params || {}

  return useQuery({
    queryKey: [currentTenant?.id, 'species', search, is_active],
    queryFn: async () => {
      if (!currentTenant?.id) {
        return []
      }

      let query = supabase
        .from('species')
        .select('*')
        .eq('tenant_id', currentTenant.id)
        .eq('is_active', is_active)
        .order('name')

      if (search) {
        query = query.ilike('name', `%${search}%`)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Error al obtener especies: ${error.message}`)
      }

      return data as Tables<'species'>[]
    },
    enabled: !!currentTenant?.id,
  })
}
