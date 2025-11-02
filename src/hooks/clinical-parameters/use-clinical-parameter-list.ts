'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Tables } from '@/types/supabase.types'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'
import { AppliedFilter } from '@/types/filters.types'
import { AppliedSort } from '@/components/ui/order-by'

interface UseClinicalParametersParams {
  petId?: string
  filters?: AppliedFilter[]
  search?: string
  orders?: AppliedSort[]
}

export function useClinicalParameterList(params?: UseClinicalParametersParams) {
  const { petId, filters = [], search, orders = [] } = params || {}
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [
      currentTenant?.id,
      'clinical-parameters',
      petId,
      filters,
      search,
      orders,
    ],
    queryFn: async () => {
      if (!currentTenant?.id) {
        throw new Error('No tenant selected')
      }

      const supabase = createClient()
      let query = supabase
        .from('clinical_parameters')
        .select('*')
        .eq('tenant_id', currentTenant.id)

      // Filter by pet if provided
      if (petId) {
        query = query.eq('pet_id', petId)
      }

      // Apply search
      if (search) {
        // Search in JSON params field or other searchable fields
        query = query.or(`params.ilike.%${search}%`)
      }

      // Apply filters
      filters.forEach((filter) => {
        if (
          filter.value !== undefined &&
          filter.value !== null &&
          filter.value !== ''
        ) {
          switch (filter.operator) {
            case 'eq':
              query = query.eq(filter.field, filter.value)
              break
            case 'neq':
              query = query.neq(filter.field, filter.value)
              break
            case 'ilike':
              query = query.ilike(filter.field, `%${filter.value}%`)
              break
            case 'like':
              query = query.like(filter.field, `%${filter.value}%`)
              break
            case 'gt':
              query = query.gt(filter.field, filter.value)
              break
            case 'lt':
              query = query.lt(filter.field, filter.value)
              break
            case 'gte':
              query = query.gte(filter.field, filter.value)
              break
            case 'lte':
              query = query.lte(filter.field, filter.value)
              break
          }
        }
      })

      // Apply sorting
      orders.forEach((order) => {
        query = query.order(order.field, { ascending: order.ascending })
      })

      // Default sorting by measured_at desc
      if (orders.length === 0) {
        query = query.order('measured_at', { ascending: false })
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      return data as Tables<'clinical_parameters'>[]
    },
    enabled: !!currentTenant?.id,
  })
}
