import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Database } from '@/types/supabase.types'
import { AppointmentFiltersSchema } from '@/schemas/appointments.schema'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

type AppointmentWithRelations = Database['public']['Tables']['appointments']['Row'] & {
  pets: Database['public']['Tables']['pets']['Row'] | null
  staff: Database['public']['Tables']['staff']['Row'] | null
  appointment_types:
    | Database['public']['Tables']['appointment_types']['Row']
    | null
}

export function useAppointments(filters?: AppointmentFiltersSchema) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: ['appointments', currentTenant?.id, filters],
    queryFn: async () => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      let query = supabase
        .from('appointments')
        .select(
          `
          *,
          pets(*),
          staff(*),
          appointment_types(*)
        `
        )
        .eq('tenant_id', currentTenant.id)
        .order('start_time', { ascending: true })

      // Aplicar filtros
      if (filters?.client_id) {
      query = query.eq('client_id', filters.client_id)
      }

      if (filters?.staff_id) {
        query = query.eq('staff_id', filters.staff_id)
      }

      if (filters?.appointment_type_id) {
        query = query.eq('appointment_type_id', filters.appointment_type_id)
      }

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      if (filters?.start_date) {
        query = query.gte('start_time', filters.start_date)
      }

      if (filters?.end_date) {
        query = query.lte('start_time', filters.end_date)
      }

      if (filters?.search) {
        // Buscar en notas de la cita o nombre del paciente
        query = query.or(
          `notes.ilike.%${filters.search}%,patients.first_name.ilike.%${filters.search}%,patients.last_name.ilike.%${filters.search}%`
        )
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Error al obtener citas: ${error.message}`)
      }

      return data as Appointment[]
    },
    enabled: !!currentTenant?.id,
  })
}
