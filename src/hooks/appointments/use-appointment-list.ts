import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Database } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { AppliedFilter, applySupabaseFilters } from '@/components/ui/filters'

export type AppointmentWithRelations =
  Database['public']['Tables']['appointments']['Row'] & {
    pets:
      | (Database['public']['Tables']['pets']['Row'] & {
          customers: Database['public']['Tables']['customers']['Row'] | null
        })
      | null
    staff: Database['public']['Tables']['staff']['Row'] | null
    appointment_types:
      | Database['public']['Tables']['appointment_types']['Row']
      | null
  }

export function useAppointmentList({ filters }: { filters?: AppliedFilter[] }) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [currentTenant?.id, 'appointments', filters],
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
            customers(*)
          ),
          staff(*),
          appointment_types(*)
        `
        )
        .eq('tenant_id', currentTenant.id)
        .order('scheduled_start', { ascending: true })

      applySupabaseFilters(query, filters)

      const { data, error } = await query

      if (error) {
        throw new Error(`Error al obtener citas: ${error.message}`)
      }

      return data
    },
    enabled: !!currentTenant?.id,
  })
}
