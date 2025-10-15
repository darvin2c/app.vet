import { useQuery } from '@tanstack/react-query'
import { Tables } from '@/types/supabase.types'

type Training = Tables<'trainings'> & {
  treatments: Tables<'treatments'> | null
  staff: Tables<'staff'> | null
}

export function usePetTrainings(petId: string) {
  return useQuery({
    queryKey: ['pet-trainings', petId],
    queryFn: async (): Promise<Training[]> => {
      // Mock data for now - replace with actual Supabase query
      const data: Training[] = []
      return data
    },
    enabled: !!petId,
  })
}
