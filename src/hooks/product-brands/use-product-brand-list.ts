import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Tables } from '@/types/supabase.types'
import { ProductBrandFilters } from '@/schemas/product-brands.schema'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

type ProductBrand = Tables<'product_brands'>

export default function useProductBrandList(filters?: ProductBrandFilters) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: ['product-brands', currentTenant?.id, filters],
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
      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`)
      }

      if (filters?.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Error al obtener marcas de productos: ${error.message}`)
      }

      return data as ProductBrand[]
    },
    enabled: !!currentTenant?.id,
  })
}