import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { Tables } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

type PetAppointment = Tables<'appointments'> & {
  appointment_types: Tables<'appointment_types'> | null
  staff: Tables<'staff'> | null
}

export function usePetAppointments(petId: string) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [currentTenant?.id, 'pet-appointments', petId],
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
            color,
            description
          ),
          staff (
            id,
            first_name,
            last_name,
            email
          )
        `
        )
        .eq('tenant_id', currentTenant.id)
        .eq('pet_id', petId)
        .order('scheduled_start', { ascending: false })

      if (error) {
        throw new Error(`Error al obtener citas: ${error.message}`)
      }

      return data as PetAppointment[]
    },
    enabled: !!currentTenant?.id && !!petId,
  })
}
