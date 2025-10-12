import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Database } from '@/types/supabase.types'
import { ProductCategoryFiltersSchema } from '@/schemas/product-categories.schema'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

type ProductCategory = Database['public']['Tables']['product_categories']['Row']

export default function useProductCategoryList(
  filters?: ProductCategoryFiltersSchema
) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: ['product-categories', currentTenant?.id, filters],
    queryFn: async () => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      let query = supabase
        .from('product_categories')
        .select('*')
        .eq('tenant_id', currentTenant.id)
        .order('created_at', { ascending: false })

      // Aplicar filtros
      if (filters?.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,code.ilike.%${filters.search}%`
        )
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
          `Error al obtener categorías de productos: ${error.message}`
        )
      }

      return data || []
    },
    enabled: !!currentTenant?.id,
  })
}
