import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { Tables } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { AppliedFilter } from '@/components/ui/filters'
import { AppliedSort } from '@/components/ui/order-by'

export function useSpeciesList({
  filters = [],
  search,
  orders = [],
}: {
  filters?: AppliedFilter[]
  search?: string
  orders?: AppliedSort[]
}) {
  const { currentTenant } = useCurrentTenantStore()

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
        query = query.filter(filter.field, filter.operator, filter.value)
      })

      // Aplicar búsqueda
      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
      }

      orders.forEach((order) => {
        query = query.order(order.field, {
          ascending: order.direction === 'asc',
        })
      })

      const { data, error } = await query

      if (error) {
        throw new Error(`Error al obtener especies: ${error.message}`)
      }

      return data
    },
    enabled: !!currentTenant?.id,
  })
}
