import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Database } from '@/types/supabase.types'
import { AppointmentFiltersSchema } from '@/schemas/appointments.schema'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

type AppointmentWithRelations =
  Database['public']['Tables']['appointments']['Row'] & {
    pets:
      | (Database['public']['Tables']['pets']['Row'] & {
          clients: Database['public']['Tables']['clients']['Row'] | null
        })
      | null
    staff: Database['public']['Tables']['staff']['Row'] | null
    appointment_types:
      | Database['public']['Tables']['appointment_types']['Row']
      | null
  }

export function useAppointmentList(filters?: AppointmentFiltersSchema) {
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
          pets(
            *,
            clients(*)
          ),
          staff(*),
          appointment_types(*)
        `
        )
        .eq('tenant_id', currentTenant.id)
        .order('scheduled_start', { ascending: true })

      // Aplicar filtros
      if (filters?.pet_id) {
        query = query.eq('pet_id', filters.pet_id)
      }

      if (filters?.veterinarian_id) {
        query = query.eq('veterinarian_id', filters.veterinarian_id)
      }

      if (filters?.appointment_type_id) {
        query = query.eq('appointment_type_id', filters.appointment_type_id)
      }

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      if (filters?.start_date) {
        query = query.gte('scheduled_start', filters.start_date)
      }

      if (filters?.end_date) {
        query = query.lte('scheduled_start', filters.end_date)
      }

      if (filters?.search) {
        // Buscar en notas de la cita o nombre de la mascota
        query = query.or(
          `notes.ilike.%${filters.search}%,pets.name.ilike.%${filters.search}%`
        )
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Error al obtener citas: ${error.message}`)
      }

      return data as AppointmentWithRelations[]
    },
    enabled: !!currentTenant?.id,
  })
}
