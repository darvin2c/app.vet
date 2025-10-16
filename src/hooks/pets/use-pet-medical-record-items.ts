import { useQuery } from '@tanstack/react-query'
import { Tables } from '@/types/supabase.types'

export type MedicalRecordItem = Tables<'record_items'> & {
  clinical_records: Tables<'clinical_records'> | null
  products: Tables<'products'> | null
}

export function usePetMedicalRecordItems(petId: string) {
  return useQuery<MedicalRecordItem[]>({
    queryKey: ['pet-medical-record-items', petId],
    queryFn: async (): Promise<MedicalRecordItem[]> => {
      // Mock data for now - replace with actual Supabase query
      return []
    },
    enabled: !!petId,
  })
}
