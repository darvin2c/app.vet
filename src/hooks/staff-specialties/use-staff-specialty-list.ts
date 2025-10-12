import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { StaffSpecialtyFilters } from '@/schemas/staff-specialties.schema'

export default function useStaffSpecialties(filters?: StaffSpecialtyFilters) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: ['staff-specialties', currentTenant?.id, filters],
    queryFn: async () => {
      if (!currentTenant?.id) {
        return []
      }

      let query = supabase
        .from('staff_specialties')
        .select(`
          *,
          staff (
            id,
            first_name,
            last_name,
            email,
            is_active
          ),
          specialties (
            id,
            name,
            is_active
          )
        `)

      // Aplicar filtros
      if (filters?.staff_id) {
        query = query.eq('staff_id', filters.staff_id)
      }

      if (filters?.specialty_id) {
        query = query.eq('specialty_id', filters.specialty_id)
      }

      // Filtro de búsqueda por nombre de staff o especialidad
      if (filters?.search) {
        query = query.or(
          `staff.first_name.ilike.%${filters.search}%,staff.last_name.ilike.%${filters.search}%,specialties.name.ilike.%${filters.search}%`
        )
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Error al obtener relaciones staff-especialidades: ${error.message}`)
      }

      return data || []
    },
    enabled: !!currentTenant?.id,
  })
}