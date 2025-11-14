import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { AppliedFilter, applySupabaseFilters } from '@/components/ui/filters'
import { AppliedSort, applySupabaseSort } from '@/components/ui/order-by'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import {
  AppliedPagination,
  applySupabasePagination,
} from '@/components/ui/pagination'
import { applySupabaseSearch } from '@/components/ui/search-input'

interface UsePetsParams {
  filters?: AppliedFilter[]
  search?: string
  orders?: AppliedSort[]
  pagination?: AppliedPagination
}

export function usePetList({
  filters = [],
  search,
  orders = [],
  pagination,
}: UsePetsParams) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [currentTenant?.id, 'pets', filters, search, orders, pagination],
    queryFn: async () => {
      if (!currentTenant?.id) {
        throw new Error('Tenant ID is required')
      }

      let query = supabase
        .from('pets')
        .select(
          `
          *,
          customers (
            id,
            first_name,
            last_name,
            email,
            phone
          ),
          breeds (
            id,
            name
          ),
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

      query = applySupabaseFilters(query, filters)
      query = applySupabaseSort(query, orders)
      query = applySupabasePagination(query, pagination)
      query = applySupabaseSearch(query, search, ['name', 'microchip'])

      const { data, count, error } = await query

      if (error) {
        throw new Error(`Error al obtener mascotas: ${error.message}`)
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
