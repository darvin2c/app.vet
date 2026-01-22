import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Tables } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { AppliedFilter, applySupabaseFilters } from '@/components/ui/filters'

export type AppointmentWithRelations = Tables<'appointments'> & {
  pets:
    | (Tables<'pets'> & {
        customers: Tables<'customers'> | null
      })
    | null
  staff: Tables<'staff'> | null
  appointment_types: Tables<'appointment_types'> | null
}

export function useAppointmentList({ filters }: { filters?: AppliedFilter[] }) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [currentTenant?.id, 'appointments', filters],
    queryFn: async () => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const query = supabase
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
