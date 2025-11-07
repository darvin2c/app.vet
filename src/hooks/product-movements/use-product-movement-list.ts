import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Database } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { AppliedFilter } from '@/components/ui/filters'
import { AppliedSort } from '@/components/ui/order-by'

type ProductMovement = Database['public']['Tables']['product_movements']['Row']

export type ProductMovementWithProduct = ProductMovement & {
  products?: {
    id: string
    name: string
    sku: string | null
    stock: number | null
    product_categories?: {
      id: string
      name: string
      description: string | null
    } | null
    product_units?: {
      id: string
      name: string | null
      abbreviation: string | null
    } | null
  } | null
}

export default function useProductMovementList({
  filters = [],
  orders = [
    {
      field: 'created_at',
      direction: 'desc',
    },
  ],
  search,
}: {
  filters?: AppliedFilter[]
  orders?: AppliedSort[]
  search?: string
}) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [currentTenant?.id, 'product-movements', filters, search, orders],
    queryFn: async () => {
      if (!currentTenant?.id) {
        return []
      }

      let query = supabase
        .from('product_movements')
        .select(
          `
          *,
          products (
            id,
            name,
            sku,
            stock,
            product_categories (
              id,
              name,
              description
            ),
            product_units (
              id,
              name,
              abbreviation
            )
          )
        `
        )
        .eq('tenant_id', currentTenant.id)

      filters.forEach((filter) => {
        query.filter(filter.field, filter.operator, filter.value)
      })

      if (search) {
        query = query.filter('products.name', 'ilike', `%${search}%`)
      }

      orders.forEach((order) => {
        query = query.order(order.field, {
          ascending: order.direction === 'asc',
        })
      })

      const { data, error } = await query

      if (error) {
        throw new Error(
          `Error al obtener movimientos de productos: ${error.message}`
        )
      }

      return data
    },
    enabled: !!currentTenant?.id,
  })
}
