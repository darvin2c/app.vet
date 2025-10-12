import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Database } from '@/types/supabase.types'
import { StaffFilters } from '@/schemas/staff.schema'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

type Staff = Database['public']['Tables']['staff']['Row']

export default function useStaffList(filters?: StaffFilters) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: ['staff-list', currentTenant?.id, filters],
    queryFn: async () => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      // Consulta con join para obtener las especialidades
      let query = supabase
        .from('staff')
        .select(
          `
          *,
          staff_specialties (
            specialty_id,
            specialties (
              id,
              name,
              is_active
            )
          )
        `
        )
        .eq('tenant_id', currentTenant.id)
        .order('created_at', { ascending: false })

      // Aplicar filtros
      if (filters?.search) {
        query = query.or(
          `full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
        )
      }

      if (filters?.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active)
      }



      if (filters?.created_from) {
        query = query.gte('created_at', filters.created_from)
      }

      if (filters?.created_to) {
        query = query.lte('created_at', filters.created_to)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Error al obtener staff: ${error.message}`)
      }

      // Transformar los datos para incluir las especialidades
      const staffWithSpecialties =
        data?.map((staffMember) => ({
          ...staffMember,
          specialties:
            staffMember.staff_specialties
              ?.map((ss: any) => ss.specialties)
              .filter(Boolean) || [],
        })) || []

      return staffWithSpecialties
    },
    enabled: !!currentTenant?.id,
  })
}
