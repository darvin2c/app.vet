import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

export function useStaffSpecialties(staffId: string) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: ['staff-specialties', currentTenant?.id, staffId],
    queryFn: async () => {
      if (!currentTenant?.id || !staffId) {
        return []
      }

      const { data, error } = await supabase
        .from('staff_specialties')
        .select(
          `
          specialty_id,
          specialties (
            id,
            name
          )
        `
        )
        .eq('staff_id', staffId)

      if (error) {
        throw new Error(
          `Error al obtener especialidades del staff: ${error.message}`
        )
      }

      return data?.map((item) => item.specialties).filter(Boolean) || []
    },
    enabled: !!currentTenant?.id && !!staffId,
  })
}
