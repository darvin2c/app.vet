import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Tables } from '@/types/supabase.types'
import useCurrentTenant from '@/hooks/tenants/use-current-tenant-store'

export function usePetClinicalNotes(petId: string) {
  const { currentTenant } = useCurrentTenant()

  return useQuery({
    queryKey: [currentTenant?.id, 'pet-clinical-notes', petId],
    queryFn: async () => {
      if (!currentTenant?.id || !petId) {
        return []
      }

      const supabase = createClient()
      const { data, error } = await supabase
        .from('clinical_notes')
        .select(
          `
          *,
          medical_records (
            id,
            type,
            date,
            status,
            pet_id
          ),
          hospitalizations (
            id,
            admission_at,
            discharge_at,
            pet_id
          )
        `
        )
        .eq('tenant_id', currentTenant.id)
        .eq('pet_id', petId)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(
          `Error al obtener notas clínicas de la mascota: ${error.message}`
        )
      }

      return (data || []) as unknown as (Tables<'clinical_notes'> & {
        medical_records: Tables<'medical_records'> | null
        hospitalizations: Tables<'hospitalizations'> | null
      })[]
    },
    enabled: !!currentTenant?.id && !!petId,
  })
}
