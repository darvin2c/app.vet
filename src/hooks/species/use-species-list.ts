import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { Tables } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { AppliedFilter } from '@/types/filters.types'
import { AppliedSort } from '@/components/ui/order-by'

interface UseSpeciesParams {
  filters?: AppliedFilter[]
  search?: string
  orders?: AppliedSort[]
  is_active?: boolean
}

export function useSpeciesList(params?: UseSpeciesParams) {
  const { currentTenant } = useCurrentTenantStore()
  const { filters = [], search, orders = [] } = params || {}

  return useQuery({
    queryKey: [currentTenant?.id, 'species', filters, search, orders],
    queryFn: async () => {
      if (!currentTenant?.id) {
        return []
      }

      let query = supabase
        .from('species')
        .select('*')
        .eq('tenant_id', currentTenant.id)

      // Aplicar filtros
      filters.forEach((filter) => {
        switch (filter.operator) {
          case 'eq':
            query = query.eq(filter.field, filter.value)
            break
          case 'gte':
            query = query.gte(filter.field, filter.value)
            break
          case 'lte':
            query = query.lte(filter.field, filter.value)
            break
          case 'like':
            query = query.like(filter.field, `%${filter.value}%`)
            break
          case 'ilike':
            query = query.ilike(filter.field, `%${filter.value}%`)
            break
          case 'in':
            query = query.in(filter.field, filter.value)
            break
        }
      })

      // Aplicar búsqueda
      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
      }

      // Aplicar ordenamiento
      if (orders.length > 0) {
        orders.forEach((order) => {
          query = query.order(order.field, {
            ascending: order.direction === 'asc',
          })
        })
      } else {
        // Orden por defecto
        query = query.order('name')
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Error al obtener especies: ${error.message}`)
      }

      return data as Tables<'species'>[]
    },
    enabled: !!currentTenant?.id,
  })
}
