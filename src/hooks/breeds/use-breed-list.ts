import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { AppliedFilter, applySupabaseFilters } from '@/components/ui/filters'
import { AppliedSort, applySupabaseSort } from '@/components/ui/order-by'
import {
  AppliedPagination,
  applySupabasePagination,
} from '@/components/ui/pagination'
import { applySupabaseSearch } from '@/components/ui/search-input'

interface UseBreedsParams {
  species_id?: string
  filters?: AppliedFilter[]
  search?: string
  orders?: AppliedSort[]
  pagination?: AppliedPagination
}

export function useBreedsList({
  filters = [],
  search,
  orders = [],
  pagination,
  species_id,
}: UseBreedsParams) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [
      currentTenant?.id,
      'breeds',
      filters,
      search,
      orders,
      pagination,
      species_id,
    ],
    queryFn: async () => {
      if (!currentTenant?.id) {
        throw new Error('No se ha seleccionado un tenant')
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
        `,
          {
            count: 'exact',
          }
        )
        .eq('tenant_id', currentTenant.id)

      if (species_id) {
        query = query.eq('species_id', species_id)
      }

      // Filtro
      query = applySupabaseFilters(query, filters)

      // Aplicar ordenamiento por defecto
      query = applySupabaseSort(query, orders)

      // Aplicar paginación
      query = applySupabasePagination(query, pagination)

      // Aplicar búsqueda
      query = applySupabaseSearch(query, search, ['name', 'description'])

      const { data, count, error } = await query

      if (error) {
        throw new Error(`Error al obtener razas: ${error.message}`)
      }

      return {
        data,
        total: count || 0,
        ...pagination,
      }
    },
    enabled: !!currentTenant?.id,
  })
}
