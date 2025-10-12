import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Tables } from '@/types/supabase.types'
import { ClientFilters } from '@/schemas/clients.schema'

type Client = Tables<'clients'>

interface UseClientsOptions {
  filters?: ClientFilters
  enabled?: boolean
}

export function useClients(options: UseClientsOptions = {}) {
  const { filters = {}, enabled = true } = options

  return useQuery({
    queryKey: ['clients', filters],
    queryFn: async (): Promise<Client[]> => {
      let query = supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

      // Aplicar filtros
      if (filters.search) {
        query = query.or(
          `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
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