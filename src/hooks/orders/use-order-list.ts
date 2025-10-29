import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Tables } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { AppliedFilter } from '@/types/filters.types'
import { AppliedSort } from '@/types/order-by.types'

type Order = Tables<'orders'> & {
  customers: Tables<'customers'> | null
  order_items: Array<
    Tables<'order_items'> & {
      products: Tables<'products'> | null
    }
  >
}

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
    queryKey: [currentTenant?.id, 'orders', JSON.stringify(filters), search],
    queryFn: async (): Promise<Order[]> => {
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
          )
        `
        )
        .eq('tenant_id', currentTenant.id)

      // Aplicar filtros
      filters.forEach((filter) => {
        query = query.filter(filter.field, filter.operator, filter.value)
      })

      // Aplicar ordenamiento
      console.log(orders)
      orders.forEach((order) => {
        query = query.order(order.field, {
          ascending: order.ascending,
        })
      })

      // Aplicar búsqueda global
      if (search) {
        query = query.or(
          `order_number.ilike.%${search}%,notes.ilike.%${search}%,customers.first_name.ilike.%${search}%,customers.last_name.ilike.%${search}%,customers.doc_id.ilike.%${search}%`
        )
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Error al obtener órdenes: ${error.message}`)
      }

      return data || []
    },
    enabled: !!currentTenant?.id,
  })
}
