import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Database } from '@/types/supabase.types'
import { SpecialtyFilters } from '@/schemas/specialties.schema'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

type Specialty = Database['public']['Tables']['specialties']['Row']

export default function useSpecialties(filters?: SpecialtyFilters) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: ['specialties', currentTenant?.id, filters],
    queryFn: async () => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      let query = supabase
        .from('specialties')
        .select('*')
        .eq('tenant_id', currentTenant.id)
        .order('created_at', { ascending: false })

      // Aplicar filtros
      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`)
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
        throw new Error(`Error al obtener especialidades: ${error.message}`)
      }

      return data as Specialty[]
    },
    enabled: !!currentTenant?.id,
  })
}
