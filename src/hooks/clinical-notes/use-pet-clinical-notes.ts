import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Tables } from '@/types/supabase.types'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'

export function usePetClinicalNotes(petId: string) {
  const { currentTenant } = useCurrentTenantStore()

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
          clinical_records (
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
        clinical_records: Tables<'clinical_records'> | null
      })[]
    },
    enabled: !!currentTenant?.id && !!petId,
  })
}
