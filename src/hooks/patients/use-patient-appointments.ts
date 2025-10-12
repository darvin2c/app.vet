import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Database } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

type Appointment = Database['public']['Tables']['appointments']['Row']

export function usePatientAppointments(patientId: string) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: ['patient-appointments', currentTenant?.id, patientId],
    queryFn: async () => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      if (!patientId) {
        throw new Error('ID de paciente requerido')
      }

      const { data, error } = await supabase
        .from('appointments')
        .select(
          `
          *,
          patients:patient_id (
            id,
            first_name,
            last_name,
            email,
            phone,
            date_of_birth,
            address,
            allergies,
            systemic_diseases
          ),
          staff:staff_id (
            id,
            first_name,
            last_name
          ),
          procedures:procedure_id (
            id,
            name,
            base_price,
            description
          ),
          appointment_types:appointment_type_id (
            id,
            name,
            color,
            code,
            active
          )
        `
        )
        .eq('tenant_id', currentTenant.id)
        .eq('patient_id', patientId)
        .order('start_time', { ascending: false })

      if (error) {
        throw new Error(`Error al obtener citas del paciente: ${error.message}`)
      }

      return data as (Appointment & {
        patients: {
          id: string
          first_name: string
          last_name: string
          email: string | null
          phone: string | null
          date_of_birth: string | null
          address: string | null
          allergies: string | null
          systemic_diseases: string | null
        } | null
        staff: {
          id: string
          first_name: string
          last_name: string
        } | null
        procedures: {
          id: string
          name: string
          base_price: number | null
          description: string | null
        } | null
        appointment_types: {
          id: string
          name: string
          color: string | null
          code: string | null
          active: boolean
        } | null
      })[]
    },
    enabled: !!currentTenant?.id && !!patientId,
  })
}

// Hook para obtener la próxima cita del paciente
export function usePatientNextAppointment(patientId: string) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: ['patient-next-appointment', currentTenant?.id, patientId],
    queryFn: async () => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      if (!patientId) {
        throw new Error('ID de paciente requerido')
      }

      const { data, error } = await supabase
        .from('appointments')
        .select(
          `
          *,
          patients:patient_id (
            id,
            first_name,
            last_name,
            email,
            phone,
            date_of_birth,
            address,
            allergies,
            systemic_diseases
          ),
          staff:staff_id (
            id,
            first_name,
            last_name
          ),
          procedures:procedure_id (
            id,
            name,
            base_price,
            description
          ),
          appointment_types:appointment_type_id (
            id,
            name,
            color,
            code,
            active
          )
        `
        )
        .eq('tenant_id', currentTenant.id)
        .eq('patient_id', patientId)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(1)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No hay próxima cita
          return null
        }
        throw new Error(
          `Error al obtener próxima cita del paciente: ${error.message}`
        )
      }

      return data as Appointment & {
        patients: {
          id: string
          first_name: string
          last_name: string
          email: string | null
          phone: string | null
          date_of_birth: string | null
          address: string | null
          allergies: string | null
          systemic_diseases: string | null
        } | null
        staff: {
          id: string
          first_name: string
          last_name: string
        } | null
        procedures: {
          id: string
          name: string
          base_price: number | null
          description: string | null
        } | null
        appointment_types: {
          id: string
          name: string
          color: string | null
          code: string | null
          active: boolean
        } | null
      }
    },
    enabled: !!currentTenant?.id && !!patientId,
  })
}
