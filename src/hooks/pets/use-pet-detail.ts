import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { Tables } from '@/types/supabase.types'

type PetDetail = Tables<'pets'> & {
  clients: Tables<'clients'> | null
  breeds: Tables<'breeds'> | null
}

export function usePetDetail(id: string) {
  return useQuery({
    queryKey: ['pet', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pets')
        .select(
          `
          *,
          clients (
            id,
            full_name,
            email,
            phone,
            address
          ),
          breeds (
            id,
            name,
            species_id
          )
        `
        )
        .eq('id', id)
        .single()

      if (error) {
        throw new Error(`Error al obtener mascota: ${error.message}`)
      }

      return data as PetDetail
    },
    enabled: !!id,
  })
}
