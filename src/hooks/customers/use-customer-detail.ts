import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { Tables } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

type Customer = Tables<'customers'>

export default function useCustomerDetail(customerId: string | undefined) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [currentTenant?.id, 'customers', customerId],
    queryFn: async (): Promise<Customer | null> => {
      if (!customerId || !currentTenant?.id) return null

      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', customerId)
        .eq('tenant_id', currentTenant.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No se encontró el cliente
          return null
        }
        throw new Error(`Error al obtener cliente: ${error.message}`)
      }

      return data
    },
    enabled: !!customerId && !!currentTenant?.id,
  })
}
