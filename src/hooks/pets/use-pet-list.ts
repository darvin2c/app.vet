import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { PetFilters } from '@/schemas/pets.schema'
import { Tables } from '@/types/supabase.types'

type Pet = Tables<'pets'> & {
  clients: Tables<'clients'> | null
  breeds: Tables<'breeds'> | null
}

export function usePets(filters?: PetFilters) {
  return useQuery({
    queryKey: ['pets', filters],
    queryFn: async () => {
      let query = supabase
        .from('pets')
        .select(
          `
          *,
          clients (
            id,
            full_name,
            email,
            phone
          ),
          breeds (
            id,
            name
          )
        `
        )
        .order('created_at', { ascending: false })

      // Aplicar filtros
      if (filters?.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,species.ilike.%${filters.search}%`
        )
      }

      if (filters?.client_id) {
        query = query.eq('client_id', filters.client_id)
      }

      if (filters?.species_id) {
        query = query.eq('species_id', filters.species_id)
      }

      if (filters?.breed_id) {
        query = query.eq('breed_id', filters.breed_id)
      }

      if (filters?.sex) {
        query = query.eq('sex', filters.sex)
      }

      if (filters?.created_from) {
        query = query.gte('created_at', filters.created_from)
      }

      if (filters?.created_to) {
        query = query.lte('created_at', filters.created_to)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Error al obtener mascotas: ${error.message}`)
      }

      return data
    },
  })
}
