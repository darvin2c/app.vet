import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { Tables } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { AppliedFilter } from '@/components/ui/filters'
import { AppliedSort } from '@/components/ui/order-by'

interface UseSpecialtyListParams {
  filters?: AppliedFilter[]
  search?: string
  orders?: AppliedSort[]
  is_active?: boolean
}

export function useSpecialtyList(params?: UseSpecialtyListParams) {
  const { currentTenant } = useCurrentTenantStore()
  const { filters = [], search, orders = [], is_active = true } = params || {}

  return useQuery({
    queryKey: [
      currentTenant?.id,
      'specialties',
      filters,
      search,
      orders,
      is_active,
    ],
    queryFn: async () => {
      if (!currentTenant?.id) {
        return []
      }

      let query = supabase
        .from('specialties')
        .select('*')
        .eq('tenant_id', currentTenant.id)

      // Aplicar filtro de activos por defecto
      if (is_active !== undefined) {
        query = query.eq('is_active', is_active)
      }

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
            ascending: order.ascending,
          })
        })
      } else {
        // Orden por defecto
        query = query.order('name')
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Error al obtener especialidades: ${error.message}`)
      }

      return data || []
    },
    enabled: !!currentTenant?.id,
  })
}
