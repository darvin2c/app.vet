import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Database, Tables } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { AppliedFilter } from '@/types/filters.types'
import { AppliedSort } from '@/types/order-by.types'

type Order = Tables<'orders'> & {
  customers: Tables<'customers'> | null
  pets: Tables<'pets'> | null
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
          pets (*),
          order_items (
            *,
            products (*)
          )
        `
        )
        .eq('tenant_id', currentTenant.id)

      // Aplicar filtros
      filters.forEach((filter) => {
        if (filter.field === 'status' && filter.value) {
          query = query.eq('status', filter.value)
        }
        if (filter.field === 'custumer_id' && filter.value) {
          query = query.eq('custumer_id', filter.value)
        }
        if (filter.field === 'pet_id' && filter.value) {
          query = query.eq('pet_id', filter.value)
        }
        if (filter.field === 'created_from' && filter.value) {
          query = query.gte('created_at', filter.value)
        }
        if (filter.field === 'created_to' && filter.value) {
          query = query.lte('created_at', filter.value)
        }
        if (filter.field === 'total_from' && filter.value) {
          query = query.gte('total', filter.value)
        }
        if (filter.field === 'total_to' && filter.value) {
          query = query.lte('total', filter.value)
        }
      })

      // Aplicar ordenamiento
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
