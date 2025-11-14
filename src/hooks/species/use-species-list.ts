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

export function useSpeciesList({
  filters = [],
  search,
  orders = [],
  pagination,
}: {
  filters?: AppliedFilter[]
  search?: string
  orders?: AppliedSort[]
  pagination?: AppliedPagination
}) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [
      currentTenant?.id,
      'species',
      filters,
      search,
      orders,
      pagination,
    ],
    queryFn: async () => {
      if (!currentTenant?.id) {
        throw new Error('No tenant selected')
      }

      let query = supabase
        .from('species')
        .select('*', { count: 'exact' })
        .eq('tenant_id', currentTenant.id)

      // Aplicar filtros
      query = applySupabaseFilters(query, filters)

      // Aplicar ordenamiento
      query = applySupabaseSort(query, orders)

      // Aplicar paginación
      query = applySupabasePagination(query, pagination)

      // Aplicar búsqueda
      query = applySupabaseSearch(query, search, ['name', 'description'])

      const { data, count, error } = await query

      if (error) {
        throw new Error(`Error al obtener especies: ${error.message}`)
      }

      return {
        data: data || [],
        page: pagination?.page,
        pageSize: pagination?.pageSize,
        total: count || 0,
      }
    },
    enabled: !!currentTenant?.id,
  })
}
