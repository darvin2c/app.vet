import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Database } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { AppliedFilter } from '@/types/filters.types'
import { AppliedSort } from '@/components/ui/order-by/order-by.types'

type Product = Database['public']['Tables']['products']['Row']

export default function useProductList({
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
    queryKey: [currentTenant?.id, 'products', JSON.stringify(filters)],
    queryFn: async (): Promise<Product[]> => {
      if (!currentTenant?.id) {
        return []
      }

      let query = supabase
        .from('products')
        .select(
          `
          *,
          product_categories (
            id,
            name,
            is_active
          ),
          product_units (
            id,
            name,
            abbreviation,
            is_active
          )
        `
        )
        .eq('tenant_id', currentTenant.id)

      // Aplicar filtros
      filters.forEach((filter) => {
        if (filter.field === 'search' && filter.value) {
          query = query.or(
            `name.ilike.%${filter.value}%,sku.ilike.%${filter.value}%,barcode.ilike.%${filter.value}%`
          )
        } else if (filter.field === 'is_active') {
          query = query.eq('is_active', filter.value)
        } else {
          query = query.filter(filter.field, filter.operator, filter.value)
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
          `name.ilike.%${search}%,sku.ilike.%${search}%,barcode.ilike.%${search}%`
        )
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Error al obtener productos: ${error.message}`)
      }

      return data || []
    },
    enabled: !!currentTenant?.id,
  })
}
