import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Tables } from '@/types/supabase.types'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'

type PetAppointment = Tables<'appointments'> & {
  appointment_types: Tables<'appointment_types'> | null
  staff: Tables<'staff'> | null
}

export function usePetAppointments(petId: string) {
  const { currentTenant } = useCurrentTenantStore()
  const supabase = createClient()

  return useQuery({
    queryKey: [currentTenant?.id, 'appointments', 'pet', petId],
    queryFn: async () => {
      if (!currentTenant?.id || !petId) {
        return []
      }

      const { data, error } = await supabase
        .from('appointments')
        .select(
          `
          *,
          appointment_types (
            id,
            name,
            color
          ),
          staff (
            id,
            first_name,
            last_name
          )
        `
        )
        .eq('tenant_id', currentTenant.id)
        .eq('pet_id', petId)
        .order('scheduled_start', { ascending: false })

      if (error) {
        throw new Error(
          `Error al obtener citas de la mascota: ${error.message}`
        )
      }

      return data as PetAppointment[]
    },
    enabled: !!currentTenant?.id && !!petId,
  })
}
