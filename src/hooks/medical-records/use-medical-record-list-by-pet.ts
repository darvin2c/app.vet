import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { Tables } from '@/types/supabase.types'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'

type PetMedicalRecord = Tables<'clinical_records'> & {
  appointments:
    | (Tables<'appointments'> & {
        appointment_types: Tables<'appointment_types'> | null
      })
    | null
  clinical_notes: Tables<'clinical_notes'>[]
  clinical_parameters: Tables<'clinical_parameters'>[]
}

export function useMedicalRecordListByPet(petId: string) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [currentTenant?.id, 'medical-records', 'by-pet', petId],
    queryFn: async (): Promise<PetMedicalRecord[]> => {
      if (!currentTenant) return []

      const { data, error } = await supabase
        .from('clinical_records')
        .select(`
          *,
          appointments(
            *,
            appointment_types(*)
          ),
          clinical_notes(*),
          clinical_parameters(*)
        `)
        .eq('tenant_id', currentTenant.id)
        .eq('pet_id', petId)
        .order('record_date', { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: !!currentTenant && !!petId,
  })
}