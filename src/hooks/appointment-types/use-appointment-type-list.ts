import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Database } from '@/types/supabase.types'
import { AppointmentTypeFiltersSchema } from '@/schemas/appointment-types.schema'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

type AppointmentType = Database['public']['Tables']['appointment_types']['Row']

const useAppointmentTypeList = (filters?: AppointmentTypeFiltersSchema) => {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: ['appointment-types', currentTenant?.id, filters],
    queryFn: async () => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      let query = supabase
        .from('appointment_types')
        .select('*')
        .eq('tenant_id', currentTenant.id)
        .order('created_at', { ascending: false })

      // Aplicar filtros
      if (filters?.active !== undefined) {
        query = query.eq('active', filters.active)
      }

      if (filters?.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,code.ilike.%${filters.search}%`
        )
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      return data as AppointmentType[]
    },
    enabled: !!currentTenant?.id,
  })
}

export { useAppointmentTypes }
export default useAppointmentTypes
