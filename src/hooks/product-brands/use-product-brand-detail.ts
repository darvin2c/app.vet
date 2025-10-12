import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Tables } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

type ProductBrand = Tables<'product_brands'>

export default function useProductBrandDetail(id: string) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: ['product-brand', id, currentTenant?.id],
    queryFn: async () => {
      if (!id || !currentTenant?.id) {
        throw new Error('ID de marca y tenant requeridos')
      }

      const { data, error } = await supabase
        .from('product_brands')
        .select('*')
        .eq('id', id)
        .eq('tenant_id', currentTenant.id)
        .single()

      if (error) {
        throw new Error(`Error al obtener marca: ${error.message}`)
      }

      return data as ProductBrand
    },
    enabled: !!id && !!currentTenant?.id,
  })
}