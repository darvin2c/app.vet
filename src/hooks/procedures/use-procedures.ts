import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Database } from '@/types/supabase.types'
import { ProcedureFilters } from '@/schemas/procedures.schema'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

type Procedure = Database['public']['Tables']['procedures']['Row']

export default function useProcedures(filters?: ProcedureFilters) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: ['procedures', currentTenant?.id, filters],
    queryFn: async () => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      let query = supabase
        .from('procedures')
        .select('*')
        .eq('tenant_id', currentTenant.id)
        .order('created_at', { ascending: false })

      // Aplicar filtros
      if (filters?.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,code.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        )
      }

      if (filters?.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active)
      }

      if (filters?.has_price !== undefined) {
        if (filters.has_price) {
          query = query.not('base_price', 'is', null)
        } else {
          query = query.is('base_price', null)
        }
      }

      if (filters?.has_cdt_code !== undefined) {
        if (filters.has_cdt_code) {
          query = query.not('cdt_code', 'is', null)
        } else {
          query = query.is('cdt_code', null)
        }
      }

      if (filters?.has_snomed_code !== undefined) {
        if (filters.has_snomed_code) {
          query = query.not('snomed_code', 'is', null)
        } else {
          query = query.is('snomed_code', null)
        }
      }

      if (filters?.price_min !== undefined) {
        query = query.gte('base_price', filters.price_min)
      }

      if (filters?.price_max !== undefined) {
        query = query.lte('base_price', filters.price_max)
      }

      if (filters?.created_from) {
        query = query.gte('created_at', filters.created_from)
      }

      if (filters?.created_to) {
        query = query.lte('created_at', filters.created_to)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Error al obtener procedimientos: ${error.message}`)
      }

      return data as Procedure[]
    },
    enabled: !!currentTenant?.id,
  })
}
