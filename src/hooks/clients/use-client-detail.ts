import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Tables } from '@/types/supabase.types'

type Client = Tables<'clients'>

export function useClientDetail(clientId: string | undefined) {
  return useQuery({
    queryKey: ['client', clientId],
    queryFn: async (): Promise<Client | null> => {
      if (!clientId) return null

      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
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
    enabled: !!clientId,
  })
}