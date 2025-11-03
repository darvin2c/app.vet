import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Database } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

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

interface ProductMovementFilters {
  search?: string
  product_id?: string
  date_from?: string
  date_to?: string
}

export default function useProductMovementList(
  filters?: ProductMovementFilters
) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: ['product-movements', currentTenant?.id, filters],
    queryFn: async (): Promise<ProductMovementWithProduct[]> => {
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
        .order('created_at', { ascending: false })

      // Aplicar filtros
      if (filters?.search) {
        query = query.or(
          `note.ilike.%${filters.search}%,reference.ilike.%${filters.search}%`
        )
      }

      if (filters?.product_id) {
        query = query.eq('product_id', filters.product_id)
      }



      if (filters?.date_from) {
        query = query.gte('created_at', filters.date_from)
      }

      if (filters?.date_to) {
        query = query.lte('created_at', filters.date_to)
      }

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
