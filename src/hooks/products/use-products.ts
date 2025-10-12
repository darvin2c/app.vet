import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Database } from '@/types/supabase.types'
import { ProductFiltersSchema } from '@/schemas/products.schema'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

type Product = Database['public']['Tables']['products']['Row']

export default function useProducts(filters?: ProductFiltersSchema) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: ['products', currentTenant?.id, filters],
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
            code,
            is_active
          ),
          product_units (
            id,
            name,
            code,
            decimals,
            is_active
          )
        `
        )
        .eq('tenant_id', currentTenant.id)
        .order('created_at', { ascending: false })

      // Aplicar filtros
      if (filters?.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`
        )
      }

      if (filters?.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active)
      }

      if (filters?.category_id) {
        query = query.eq('category_id', filters.category_id)
      }

      if (filters?.unit_id) {
        query = query.eq('unit_id', filters.unit_id)
      }

      if (filters?.min_stock_from !== undefined) {
        query = query.gte('min_stock', filters.min_stock_from)
      }

      if (filters?.min_stock_to !== undefined) {
        query = query.lte('min_stock', filters.min_stock_to)
      }

      if (filters?.created_from) {
        query = query.gte('created_at', filters.created_from)
      }

      if (filters?.created_to) {
        query = query.lte('created_at', filters.created_to)
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
