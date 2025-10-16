import { useQuery } from '@tanstack/react-query'
import { Tables } from '@/types/supabase.types'

type Vaccination = Tables<'vaccinations'> & {
  clinical_records: Tables<'clinical_records'> | null
  staff: Tables<'staff'> | null
}

export function usePetVaccinations(petId: string) {
  return useQuery({
    queryKey: ['pet-vaccinations', petId],
    queryFn: async (): Promise<Vaccination[]> => {
      // Mock data for now - replace with actual Supabase query
      const data: Vaccination[] = []
      return data
    },
    enabled: !!petId,
  })
}
