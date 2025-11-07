import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Tables } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { AppliedFilter } from '@/components/ui/filters'
import { AppliedSort } from '@/components/ui/order-by'

type ProductBrand = Tables<'product_brands'>

export default function useProductBrandList({
  filters = [],
  orders = [],
  search,
}: {
  filters?: AppliedFilter[]
  orders?: AppliedSort[]
  search?: string
}) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [currentTenant?.id, 'product-brands', filters, orders, search],
    queryFn: async () => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      let query = supabase
        .from('product_brands')
        .select('*')
        .eq('tenant_id', currentTenant.id)
        .order('name', { ascending: true })

      // Aplicar filtros
      filters.forEach((filter) => {
        query.filter(filter.field, filter.operator, filter.value)
      })

      // Aplicar ordenamiento
      orders.forEach((order) => {
        query = query.order(order.field, {
          ascending: order.direction === 'asc',
        })
      })

      // Aplicar búsqueda
      if (search) {
        query = query.ilike('name', `%${search}%`)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(
          `Error al obtener marcas de productos: ${error.message}`
        )
      }

      return data as ProductBrand[]
    },
    enabled: !!currentTenant?.id,
  })
}
