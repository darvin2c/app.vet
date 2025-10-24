import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { OrderItemFiltersSchema } from '@/schemas/order-items.schema'
import { AppliedFilter } from '@/types/filters.types'
import { AppliedSort } from '@/types/order-by.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

export default function useOrderItemsList({
  orderId,
  filters = [],
  search,
  orders = [
    {
      field: 'created_at',
      ascending: false,
      direction: 'desc',
    },
  ],
}: {
  orderId: string
  filters?: AppliedFilter[]
  search?: string
  orders?: AppliedSort[]
}) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [
      currentTenant?.id,
      'order-items',
      orderId,
      filters,
      search,
      orders,
    ],
    queryFn: async () => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      let query = supabase
        .from('order_items')
        .select(
          `
          *,
          products (
            id,
            name,
            sku,
            stock
          )
        `
        )
        .eq('tenant_id', currentTenant.id)
        .eq('order_id', orderId)

      // Aplicar filtros
      filters.forEach((filter) => {
        if (
          filter.value !== undefined &&
          filter.value !== null &&
          filter.value !== ''
        ) {
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
            case 'like':
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

      // Aplicar búsqueda global
      if (search && search.trim() !== '') {
        query = query.or(
          `description.ilike.%${search}%,products.name.ilike.%${search}%,products.sku.ilike.%${search}%`
        )
      }

      // Aplicar ordenamiento
      orders.forEach((order) => {
        query = query.order(order.field, { ascending: order.ascending })
      })

      const { data, error } = await query

      if (error) {
        throw new Error(`Error al obtener items de orden: ${error.message}`)
      }

      return data || []
    },
    enabled: !!currentTenant?.id && !!orderId,
  })
}
