import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Database } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { AppliedFilter } from '@/types/filters.types'
import { AppliedSort } from '@/types/order-by.types'

type ProductCategory = Database['public']['Tables']['product_categories']['Row']

interface UseProductCategoryListParams {
  filters?: AppliedFilter[]
  search?: string
  orders?: AppliedSort[]
}

export default function useProductCategoryList({
  filters = [],
  search,
  orders = [],
}: UseProductCategoryListParams = {}) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [currentTenant?.id, 'product-categories', filters, search, orders],
    queryFn: async () => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      let query = supabase
        .from('product_categories')
        .select('*')
        .eq('tenant_id', currentTenant.id)

      // Aplicar filtros
      filters.forEach((filter) => {
        if (filter.value !== undefined && filter.value !== null && filter.value !== '') {
          switch (filter.operator) {
            case 'eq':
              query = query.eq(filter.field, filter.value)
              break
            case 'neq':
              query = query.neq(filter.field, filter.value)
              break
            case 'gt':
              query = query.gt(filter.field, filter.value)
              break
            case 'gte':
              query = query.gte(filter.field, filter.value)
              break
            case 'lt':
              query = query.lt(filter.field, filter.value)
              break
            case 'lte':
              query = query.lte(filter.field, filter.value)
              break
            case 'ilike':
              query = query.ilike(filter.field, `%${filter.value}%`)
              break
            case 'in':
              if (Array.isArray(filter.value)) {
                query = query.in(filter.field, filter.value)
              }
              break
          }
        }
      })

      // Aplicar búsqueda
      if (search) {
        query = query.or(
          `name.ilike.%${search}%,description.ilike.%${search}%`
        )
      }

      // Aplicar ordenamiento
      if (orders.length > 0) {
        orders.forEach((order) => {
          query = query.order(order.field, { ascending: order.direction === 'asc' })
        })
      } else {
        // Orden por defecto
        query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query

      if (error) {
        throw new Error(
          `Error al obtener categorías de productos: ${error.message}`
        )
      }

      return data || []
    },
    enabled: !!currentTenant?.id,
  })
}
