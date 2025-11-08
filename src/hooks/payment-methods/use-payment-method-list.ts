import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'
import { AppliedFilter, applySupabaseFilters } from '@/components/ui/filters'
import { AppliedSort } from '@/components/ui/order-by'
import { applySupabaseSort } from '@/components/ui/order-by/generate-supabase-sort'
import { applySupabasePagination } from '@/components/ui/pagination/generate-supabase-pagination'
import { AppliedPagination } from '@/components/ui/pagination/types'
import { applySupabaseSearch } from '@/components/ui/search-input'

export function usePaymentMethodList({
  filters = [],
  search,
  orders = [
    {
      field: 'created_at',
      direction: 'asc',
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
      'payment_methods',
      filters,
      search,
      orders,
      pagination,
    ],
    queryFn: async () => {
      if (!currentTenant?.id) {
        throw new Error('No tenant selected')
      }

      // Build the query
      let query = supabase
        .from('payment_methods')
        .select('*', { count: 'exact' })
        .eq('tenant_id', currentTenant.id)

      // Apply filters
      query = applySupabaseFilters(query, filters)
      query = applySupabaseSort(query, orders)
      query = applySupabasePagination(query, pagination)

      // Apply search
      query = applySupabaseSearch(query, search, ['name'])

      const { data, count, error } = await query

      if (error) {
        throw error
      }

      return {
        data: data || [],
        page: pagination.page,
        pageSize: pagination.pageSize,
        total: count || 0,
      }
    },
    enabled: !!currentTenant?.id,
  })
}
