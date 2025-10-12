import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Database } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

type ProductMovement = Database['public']['Tables']['product_movements']['Row']

interface ProductMovementFilters {
  search?: string
  product_id?: string
  reference_type?: string
  date_from?: string
  date_to?: string
}

export default function useProductMovements(filters?: ProductMovementFilters) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: ['product-movements', currentTenant?.id, filters],
    queryFn: async (): Promise<ProductMovement[]> => {
      if (!currentTenant?.id) {
        return []
      }

      let query = supabase
        .from('product_movements')
        .select(
          `
          *,
          products (
            *
            product_categories (
             *
            ),
            product_units (
              *
            )
          )
        `
        )
        .eq('tenant_id', currentTenant.id)
        .order('movement_date', { ascending: false })

      // Aplicar filtros
      if (filters?.search) {
        query = query.or(
          `note.ilike.%${filters.search}%,reference_id.ilike.%${filters.search}%`
        )
      }

      if (filters?.product_id) {
        query = query.eq('product_id', filters.product_id)
      }

      if (filters?.reference_type) {
        query = query.eq('reference_type', filters.reference_type)
      }

      if (filters?.date_from) {
        query = query.gte('movement_date', filters.date_from)
      }

      if (filters?.date_to) {
        query = query.lte('movement_date', filters.date_to)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(
          `Error al obtener movimientos de productos: ${error.message}`
        )
      }

      return data || []
    },
    enabled: !!currentTenant?.id,
  })
}
