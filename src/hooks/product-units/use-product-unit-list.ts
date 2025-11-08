import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { AppliedFilter, applySupabaseFilters } from '@/components/ui/filters'
import { AppliedSort, applySupabaseSort } from '@/components/ui/order-by'
import { toast } from 'sonner'
import {
  AppliedPagination,
  applySupabasePagination,
} from '@/components/ui/pagination'
import { applySupabaseSearch } from '@/components/ui/search-input'

export default function useProductUnitList({
  filters = [],
  orders = [],
  search,
  pagination,
}: {
  filters?: AppliedFilter[]
  orders?: AppliedSort[]
  search?: string
  pagination: AppliedPagination
}) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [
      currentTenant?.id,
      'product-units',
      filters,
      orders,
      search,
      pagination,
    ],
    queryFn: async () => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      let query = supabase
        .from('product_units')
        .select('*', { count: 'exact' })
        .eq('tenant_id', currentTenant.id)

      // Aplicar filtros
      query = applySupabaseFilters(query, filters)

      // Aplicar ordenamientos
      query = applySupabaseSort(query, orders)

      // Aplicar paginación
      query = applySupabasePagination(query, pagination)

      // Aplicar búsqueda
      query = applySupabaseSearch(query, search, ['abbreviation', 'name'])

      const { data, count, error } = await query

      if (error) {
        throw new Error(
          `Error al obtener unidades de productos: ${error.message}`
        )
      }

      return {
        data,
        total: count || 0,
        ...pagination,
      }
    },
  })
}
