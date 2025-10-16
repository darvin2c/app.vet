import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { Tables } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

type PetMedicalRecord = Tables<'clinical_records'> & {
  appointments:
    | (Tables<'appointments'> & {
        appointment_types: Tables<'appointment_types'> | null
      })
    | null
  clinical_notes: Tables<'clinical_notes'>[]
  clinical_parameters: Tables<'clinical_parameters'>[]
  boardings: Tables<'boardings'>[]
}

export function usePetMedicalRecords(petId: string) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [currentTenant?.id, 'pet-medical-records', petId],
    queryFn: async () => {
      if (!currentTenant?.id || !petId) {
        return []
      }

      // Primero obtenemos las citas de la mascota
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('id')
        .eq('tenant_id', currentTenant.id)
        .eq('pet_id', petId)

      if (appointmentsError) {
        throw new Error(`Error al obtener citas: ${appointmentsError.message}`)
      }

      if (!appointments || appointments.length === 0) {
        return []
      }

      const appointmentIds = appointments.map((a) => a.id)

      // Luego obtenemos los registros médicos relacionados con esas citas
      const { data, error } = await supabase
        .from('clinical_records')
        .select(
          `
          *,
          appointments (
            id,
            scheduled_start,
            reason,
            appointment_types (
              id,
              name,
              color
            )
          ),
          clinical_notes (
            id,
            content,
            created_at,
            created_by
          ),
          clinical_parameters (
            id,
            params,
            measured_at,
            schema_version,
            created_at
          ),

          boardings (
            id,
            check_in_at,
            check_out_at,
            daily_rate,
            feeding_notes,
            observations,
            kennel_id
          )
        `
        )
        .eq('tenant_id', currentTenant.id)
        .in('appointment_id', appointmentIds)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Error al obtener registros médicos: ${error.message}`)
      }

      return (data || []) as unknown as PetMedicalRecord[]
    },
    enabled: !!currentTenant?.id && !!petId,
  })
}
