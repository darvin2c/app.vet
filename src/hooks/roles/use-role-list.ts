import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Tables } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { AppliedFilter } from '@/components/ui/filters'
import { AppliedSort } from '@/components/ui/order-by'

type Role = Tables<'roles'>

export function useRoleList({
  filters = [],
  search,
  orders = [
    {
      field: 'created_at',
      ascending: false,
      direction: 'desc',
    },
  ],
}: {
  filters?: AppliedFilter[]
  search?: string
  orders?: AppliedSort[]
}) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [
      currentTenant?.id,
      'roles',
      JSON.stringify(filters),
      search,
      JSON.stringify(orders),
    ],
    queryFn: async (): Promise<Role[]> => {
      if (!currentTenant?.id) {
        return []
      }

      let query = supabase
        .from('roles')
        .select('*')
        .eq('tenant_id', currentTenant.id)

      // Aplicar filtros
      filters.forEach((filter) => {
        if (filter.field === 'search' && filter.value) {
          query = query.or(
            `name.ilike.%${filter.value}%,description.ilike.%${filter.value}%`
          )
        } else {
          query = query.filter(filter.field, filter.operator, filter.value)
        }
      })

      // Aplicar ordenamiento
      orders.forEach((order) => {
        query = query.order(order.field, {
          ascending: order.ascending,
        })
      })

      // Aplicar búsqueda global
      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Error al obtener roles: ${error.message}`)
      }

      return data || []
    },
    enabled: !!currentTenant?.id,
  })
}
