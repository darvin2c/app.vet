import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Database } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

type Supplier = Database['public']['Tables']['suppliers']['Row']

export default function useSupplierById(id: string) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [currentTenant?.id, 'suppliers', id],
    queryFn: async (): Promise<Supplier | null> => {
      if (!currentTenant?.id || !id) {
        return null
      }

      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('tenant_id', currentTenant.id)
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null
        }
        throw new Error(`Error al obtener proveedor: ${error.message}`)
      }

      return data
    },
    enabled: !!currentTenant?.id && !!id,
  })
}
