import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Database } from '@/types/supabase.types'
import { PatientFilters } from '@/schemas/patients.schema'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

type Patient = Database['public']['Tables']['patients']['Row']

export default function usePatients(filters?: PatientFilters) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: ['patients', currentTenant?.id, filters],
    queryFn: async () => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      let query = supabase
        .from('patients')
        .select('*')
        .eq('tenant_id', currentTenant.id)
        .order('created_at', { ascending: false })

      // Aplicar filtros
      if (filters?.search) {
        query = query.or(
          `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
        )
      }

      if (filters?.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active)
      }

      if (filters?.sex) {
        query = query.eq('sex', filters.sex)
      }

      if (filters?.created_from) {
        query = query.gte('created_at', filters.created_from)
      }

      if (filters?.created_to) {
        query = query.lte('created_at', filters.created_to)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Error al obtener pacientes: ${error.message}`)
      }

      return data as Patient[]
    },
    enabled: !!currentTenant?.id,
  })
}
