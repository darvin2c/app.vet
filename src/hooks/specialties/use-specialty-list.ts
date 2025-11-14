import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { AppliedFilter, applySupabaseFilters } from '@/components/ui/filters'
import { AppliedSort } from '@/components/ui/order-by'
import { AppliedPagination } from '@/components/ui/pagination'
import { applySupabaseSort } from '@/components/ui/order-by/generate-supabase-sort'
import { applySupabasePagination } from '@/components/ui/pagination/generate-supabase-pagination'

interface UseSpecialtyListParams {
  filters?: AppliedFilter[]
  search?: string
  orders?: AppliedSort[]
  pagination?: AppliedPagination
}

export function useSpecialtyList({
  filters = [],
  search,
  orders = [
    {
      field: 'created_at',
      direction: 'asc',
    },
  ],
  pagination = {
    page: 1,
    pageSize: 10,
  },
}: UseSpecialtyListParams) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [
      currentTenant?.id,
      'specialties',
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
        .from('specialties')
        .select('*', { count: 'exact' })
        .eq('tenant_id', currentTenant.id)

      // Aplicar filtros
      query = applySupabaseFilters(query, filters)
      // Aplicar ordenamiento
      query = applySupabaseSort(query, orders)
      // Aplicar paginación
      query = applySupabasePagination(query, pagination)

      // Aplicar búsqueda
      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
      }

      const { data, error, count } = await query

      if (error) {
        throw new Error(`Error al obtener especialidades: ${error.message}`)
      }

      return {
        data: data || [],
        total: count || 0,
        page: pagination.page,
        pageSize: pagination.pageSize,
      }
    },
    enabled: !!currentTenant?.id,
  })
}
