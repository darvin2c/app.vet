import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Tables } from '@/types/supabase.types'
import useCurrentTenant from '@/hooks/tenants/use-current-tenant-store'
import { AppliedFilter } from '@/types/filters.types'
import { AppliedSort } from '@/types/order-by.types'

interface UseClinicalNotesParams {
  filters?: AppliedFilter[]
  search?: string
  orders?: AppliedSort[]
}

export function useClinicalNoteList(params?: UseClinicalNotesParams) {
  const { filters = [], search, orders = [] } = params || {}
  const { currentTenant } = useCurrentTenant()

  return useQuery({
    queryKey: [currentTenant?.id, 'clinical_notes', filters, search, orders],
    queryFn: async () => {
      if (!currentTenant?.id) {
        return []
      }

      const supabase = createClient()
      let query = supabase
        .from('clinical_notes')
        .select(
          `
          *,
          treatments (
            id,
            treatment_type,
            treatment_date
          ),
          hospitalizations (
            id,
            admission_at,
            discharge_at
          )
        `
        )
        .eq('tenant_id', currentTenant.id)

      // Aplicar búsqueda
      if (search) {
        query = query.ilike('content', `%${search}%`)
      }

      // Aplicar filtros
      filters.forEach((filter) => {
        switch (filter.field) {
          case 'treatment_id':
            query = query.eq('treatment_id', filter.value)
            break
          case 'hospitalization_id':
            query = query.eq('hospitalization_id', filter.value)
            break
        }
      })

      // Aplicar ordenamiento
      orders.forEach((order) => {
        query = query.order(order.field, { ascending: order.ascending })
      })

      // Ordenamiento por defecto
      if (orders.length === 0) {
        query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Error al obtener notas clínicas: ${error.message}`)
      }

      return data as (Tables<'clinical_notes'> & {
        treatments: Tables<'treatments'> | null
        hospitalizations: Tables<'hospitalizations'> | null
      })[]
    },
    enabled: !!currentTenant?.id,
  })
}
