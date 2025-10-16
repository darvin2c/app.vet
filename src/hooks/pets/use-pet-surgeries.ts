import { useQuery } from '@tanstack/react-query'
import { Tables } from '@/types/supabase.types'

type Surgery = Tables<'surgeries'> & {
  medical_records: Tables<'medical_records'> | null
  staff: Tables<'staff'> | null
}

export function usePetSurgeries(petId: string) {
  return useQuery({
    queryKey: ['pet-surgeries', petId],
    queryFn: async (): Promise<Surgery[]> => {
      // Mock data for now - replace with actual Supabase query
      const data: Surgery[] = []
      return data
    },
    enabled: !!petId,
  })
}
