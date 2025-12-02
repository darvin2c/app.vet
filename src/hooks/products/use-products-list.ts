'use client'

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
import { Tables } from '@/types/supabase.types'

export type Product = Tables<'products'> & {
  category?: Pick<
    Tables<'product_categories'>,
    'id' | 'name' | 'is_active'
  > | null
  unit?: Pick<
    Tables<'product_units'>,
    'id' | 'name' | 'abbreviation' | 'is_active'
  > | null
}

export default function useProductList({
  filters = [],
  search,
  orders,
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
          category:category_id (
            id,
            name,
            is_active
          ),
          unit:unit_id (
            id,
            name,
            abbreviation,
            is_active
          )
        `
        )
        .eq('tenant_id', currentTenant.id)

      // Aplicar filtros
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
    placeholderData: (prev) => prev,
    enabled: !!currentTenant?.id,
  })
}
