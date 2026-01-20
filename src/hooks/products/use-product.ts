import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { Tables } from '@/types/supabase.types'

export type Product = Tables<'products'>

export default function useProduct(productId?: string) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [currentTenant?.id, 'products', productId],
    queryFn: async () => {
      if (!currentTenant?.id || !productId) {
        return null
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .eq('tenant_id', currentTenant.id)
        .single()

      if (error) {
        throw new Error(`Error al obtener producto: ${error.message}`)
      }

      return data
    },
    enabled: !!currentTenant?.id && !!productId,
  })
}
