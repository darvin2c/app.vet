import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Database } from '@/types/supabase.types'
import { ProductUnitFiltersSchema } from '@/schemas/product-units.schema'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

type ProductUnit = Database['public']['Tables']['product_units']['Row']

export default function useProductUnitList(options?: {
  filters?: ProductUnitFiltersSchema
}) {
  const filters = options?.filters
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: ['product-units', currentTenant?.id, filters],
    queryFn: async () => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      let query = supabase
        .from('product_units')
        .select('*')
        .eq('tenant_id', currentTenant.id)
        .order('created_at', { ascending: false })

      // Aplicar filtros
      if (filters?.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,code.ilike.%${filters.search}%`
        )
      }

      if (filters?.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active)
      }

      if (filters?.created_from) {
        query = query.gte('created_at', filters.created_from)
      }

      if (filters?.created_to) {
        query = query.lte('created_at', filters.created_to)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(
          `Error al obtener unidades de productos: ${error.message}`
        )
      }

      return data || []
    },
    enabled: !!currentTenant?.id,
  })
}
