import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { Tables } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { AppliedFilter, applySupabaseFilters } from '@/components/ui/filters'
import { AppliedSort, applySupabaseSort } from '@/components/ui/order-by'
import {
  AppliedPagination,
  applySupabasePagination,
} from '@/components/ui/pagination'
import { applySupabaseSearch } from '@/components/ui/search-input'

export default function useCustomerList({
  filters = [],
  orders = [
    {
      field: 'created_at',
      direction: 'desc',
    },
  ],
  search,
  pagination,
}: {
  filters?: AppliedFilter[]
  orders?: AppliedSort[]
  search?: string
  pagination?: AppliedPagination
}) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [
      currentTenant?.id,
      'customers',
      filters,
      search,
      orders,
      pagination,
    ],
    queryFn: async () => {
      if (!currentTenant?.id) {
        throw new Error('Tenant ID no está definido')
      }

      let query = supabase
        .from('customers')
        .select('*', { count: 'exact' })
        .eq('tenant_id', currentTenant.id)

      query = applySupabaseFilters(query, filters)
      query = applySupabasePagination(query, pagination)
      query = applySupabaseSort(query, orders)
      query = applySupabaseSearch(query, search, [
        'first_name',
        'last_name',
        'doc_id',
        'email',
        'phone',
      ])

      const { data, count, error } = await query

      if (error) {
        throw new Error(`Error al obtener clientes: ${error.message}`)
      }

      return {
        data: data || [],
        total: count || 0,
        ...pagination,
      }
    },
  })
}
