import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Database } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { AppliedFilter, applySupabaseFilters } from '@/components/ui/filters'
import { AppliedSort, applySupabaseSort } from '@/components/ui/order-by'
import {
  AppliedPagination,
  applySupabasePagination,
} from '@/components/ui/pagination'
import { applySupabaseSearch } from '@/components/ui/search-input'

export default function useProductList({
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
    queryKey: [
      currentTenant?.id,
      'products',
      filters,
      orders,
      pagination,
      search,
    ],
    queryFn: async () => {
      if (!currentTenant?.id) {
        throw new Error('No se ha seleccionado un tenant')
      }

      let query = supabase
        .from('products')
        .select(
          `
          *,
          product_categories (
            id,
            name,
            is_active
          ),
          product_units (
            id,
            name,
            abbreviation,
            is_active
          )
        `
        )
        .eq('tenant_id', currentTenant.id)

      // Aplicar filtros
      console.log(filters)
      query = applySupabaseFilters(query, filters)
      query = applySupabaseSort(query, orders)
      query = applySupabasePagination(query, pagination)
      query = applySupabaseSearch(query, search, ['name', 'sku', 'barcode'])

      const { data, count, error } = await query

      if (error) {
        throw new Error(`Error al obtener productos: ${error.message}`)
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
