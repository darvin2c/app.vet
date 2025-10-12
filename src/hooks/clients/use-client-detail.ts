import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { Tables } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

type Client = Tables<'clients'>

export default function useClientDetail(clientId: string | undefined) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: ['client', currentTenant?.id, clientId],
    queryFn: async (): Promise<Client | null> => {
      if (!clientId || !currentTenant?.id) return null

      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
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
    enabled: !!clientId && !!currentTenant?.id,
  })
}