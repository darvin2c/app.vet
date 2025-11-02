import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Database } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { AppliedFilter } from '@/types/filters.types'
import { AppliedSort } from '@/components/ui/order-by'

type ProductCategory = Database['public']['Tables']['product_categories']['Row']

export default function useProductCategoryList({
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
    queryKey: [
      currentTenant?.id,
      'product-categories',
      JSON.stringify(filters),
      search,
      JSON.stringify(orders),
    ],
    queryFn: async (): Promise<ProductCategory[]> => {
      if (!currentTenant?.id) {
        return []
      }

      let query = supabase
        .from('product_categories')
        .select('*')
        .eq('tenant_id', currentTenant.id)

      // Aplicar filtros
      filters.forEach((filter) => {
        query.filter(filter.field, filter.operator, filter.value)
      })

      // Aplicar ordenamiento
      orders.forEach((order) => {
        query = query.order(order.field, {
          ascending: order.ascending,
        })
      })

      // Aplicar búsqueda global
      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
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
