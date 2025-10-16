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
          treatments (
            id,
            treatment_type,
            treatment_date,
            status
          ),
          hospitalizations (
            id,
            admission_at,
            discharge_at
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

      return data as (Tables<'clinical_notes'> & {
        treatments: Tables<'treatments'> | null
        hospitalizations: Tables<'hospitalizations'> | null
        pets?:
          | (Tables<'pets'> & {
              customers: Tables<'customers'> | null
            })
          | null
      })[]
    },
    enabled: !!currentTenant?.id && !!petId,
  })
}
