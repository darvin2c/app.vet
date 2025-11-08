import { AppliedFilter, applySupabaseFilters } from '@/components/ui/filters'
import { AppliedSort, applySupabaseSort } from '@/components/ui/order-by'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { applySupabaseSearch } from '@/components/ui/search-input'
import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import {
  AppliedPagination,
  applySupabasePagination,
} from '@/components/ui/pagination'

export default function useProductCategoryList({
  filters = [],
  search,
  orders = [
    {
      field: 'created_at',
      direction: 'desc',
    },
  ],
  pagination,
}: {
  filters?: AppliedFilter[]
  search?: string
  orders?: AppliedSort[]
  pagination: AppliedPagination
}) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [
      currentTenant?.id,
      'product-categories',
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
        .from('product_categories')
        .select('*', { count: 'exact' })
        .eq('tenant_id', currentTenant.id)

      // Aplicar filtros
      query = applySupabaseFilters(query, filters)

      // Aplicar ordenamiento
      query = applySupabaseSort(query, orders)

      // aplicar paginación
      query = applySupabasePagination(query, pagination)

      // Aplicar búsqueda global
      query = applySupabaseSearch(query, search, ['name', 'description'])

      const { data, count, error } = await query

      if (error) {
        throw new Error(
          `Error al obtener categorías de productos: ${error.message}`
        )
      }

      return {
        data: data || [],
        total: count || 0,
        ...pagination,
      }
    },
    enabled: !!currentTenant?.id,
  })
}
