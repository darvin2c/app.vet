import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Database } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { AppliedFilter } from '@/types/filters.types'
import { AppliedSort } from '@/types/order-by.types'

type Product = Database['public']['Tables']['products']['Row']

export default function useProductsList(
  filters: AppliedFilter[] = []
) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: ['products-list', currentTenant?.id, JSON.stringify(filters)],
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
            `name.ilike.%${filter.value}%,abbreviation.ilike.%${filter.value}%`
          )
        } else {
          query = query.eq(filter.field, filter.value)
        }
      })

      const { data, error } = await query

      if (error) {
        throw new Error(`Error al obtener productos: ${error.message}`)
      }

      return data || []
    },
    enabled: !!currentTenant?.id,
  })
}
