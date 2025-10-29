import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { AppliedFilter } from '@/types/filters.types'
import { AppliedSort } from '@/types/order-by.types'

export default function useOrderList({
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
  filters?: AppliedFilter[]
  search?: string
  orders?: AppliedSort[]
}) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [currentTenant?.id, orders, JSON.stringify(filters), search],
    queryFn: async () => {
      if (!currentTenant?.id) {
        return []
      }

      let query = supabase
        .from('orders')
        .select(
          `
          *,
          customers (*),
          order_items (
            *,
            products (*)
          ),
          payments (
            *,
            payment_method (*)
          )
        `
        )
        .eq('tenant_id', currentTenant.id)

      // Aplicar filtros
      filters.forEach((filter) => {
        query = query.filter(filter.field, filter.operator, filter.value)
      })

      orders.forEach((order) => {
        query = query.order(order.field, {
          ascending: order.ascending,
        })
      })

      // Aplicar búsqueda global
      if (search) {
        query = query.or(`order_number.ilike.%${search}%`)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Error al obtener órdenes: ${error.message}`)
      }

      return data
    },
    enabled: !!currentTenant?.id,
  })
}
