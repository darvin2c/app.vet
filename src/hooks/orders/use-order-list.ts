import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { AppliedFilter, applySupabaseFilters } from '@/components/ui/filters'
import { AppliedSort, applySupabaseSort } from '@/components/ui/order-by'
import {
  AppliedPagination,
  applySupabasePagination,
} from '@/components/ui/pagination'
import { applySupabaseSearch } from '@/components/ui/search-input'

export default function useOrderList({
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
  pagination?: AppliedPagination
}) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [currentTenant?.id, orders, filters, orders, pagination, search],
    queryFn: async () => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      let query = supabase
        .from('orders')
        .select(
          `
          *,
          customer:customer_id(*)
        `
        )
        .eq('tenant_id', currentTenant.id)

      // Aplicar filtros
      query = applySupabaseFilters(query, filters)
      query = applySupabaseSort(query, orders)
      query = applySupabasePagination(query, pagination)
      query = applySupabaseSearch(
        query,
        search,
        ['order_number'],
        [
          {
            referencedTable: 'customer',
            fields: ['first_name', 'last_name', 'doc_id', 'email'],
          },
        ]
      )

      const { data, count, error } = await query

      if (error) {
        throw new Error(`Error al obtener órdenes: ${error.message}`)
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
