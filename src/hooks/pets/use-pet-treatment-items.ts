import { useQuery } from '@tanstack/react-query'
import { Tables } from '@/types/supabase.types'

type TreatmentItem = Tables<'treatment_items'> & {
  treatments: Tables<'treatments'> | null
  products: Tables<'products'> | null
}

export function usePetTreatmentItems(petId: string) {
  return useQuery({
    queryKey: ['pet-treatment-items', petId],
    queryFn: async (): Promise<TreatmentItem[]> => {
      // Mock data for now - replace with actual Supabase query
      const data: TreatmentItem[] = []
      return data
    },
    enabled: !!petId,
  })
}
