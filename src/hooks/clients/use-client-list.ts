import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { Tables } from '@/types/supabase.types'
import { ClientFilters } from '@/schemas/clients.schema'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

type Client = Tables<'clients'>

interface UseClientListOptions {
  filters?: ClientFilters
  enabled?: boolean
}

export default function useClientList(options: UseClientListOptions = {}) {
  const { filters = {}, enabled = true } = options
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: ['clients', currentTenant?.id, filters],
    queryFn: async (): Promise<Client[]> => {
      if (!currentTenant?.id) {
        return []
      }

      let query = supabase
        .from('clients')
        .select('*')
        .eq('tenant_id', currentTenant.id)
        .order('created_at', { ascending: false })

      // Aplicar filtros
      if (filters.search) {
        query = query.or(
          `full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
        )
      }

      if (filters.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active)
      }

      if (filters.created_from) {
        query = query.gte('created_at', filters.created_from)
      }

      if (filters.created_to) {
        query = query.lte('created_at', filters.created_to)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Error al obtener clientes: ${error.message}`)
      }

      return data || []
    },
    enabled,
  })
}
