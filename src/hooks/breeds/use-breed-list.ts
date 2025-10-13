import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { Tables } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { AppliedFilter } from '@/types/filters.types'
import { AppliedSort } from '@/types/order-by.types'

interface UseBreedsParams {
  species_id?: string
  filters?: AppliedFilter[]
  search?: string
  orders?: AppliedSort[]
}

export function useBreedsList(params?: UseBreedsParams) {
  const { currentTenant } = useCurrentTenantStore()
  const { species_id, filters = [], search, orders = [] } = params || {}

  return useQuery({
    queryKey: [
      currentTenant?.id,
      'breeds',
      species_id,
      filters,
      search,
      orders,
    ],
    queryFn: async () => {
      if (!currentTenant?.id) {
        return []
      }

      let query = supabase
        .from('breeds')
        .select(
          `
          *,
          species (
            id,
            name
          )
        `
        )
        .eq('tenant_id', currentTenant.id)

      // Filtro por especie específica
      if (species_id) {
        query = query.eq('species_id', species_id)
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
            ascending: order.direction === 'asc',
          })
        })
      } else {
        // Orden por defecto
        query = query.order('name')
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Error al obtener razas: ${error.message}`)
      }

      return data as (Tables<'breeds'> & {
        species: Tables<'species'> | null
      })[]
    },
    enabled: !!currentTenant?.id,
  })
}
