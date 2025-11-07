import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { Tables } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { AppliedFilter } from '@/components/ui/filters'
import { AppliedSort } from '@/components/ui/order-by'

type Customer = Tables<'customers'>

export default function useCustomerList({
  filters = [],
  orders = [],
  search,
}: {
  filters?: AppliedFilter[]
  orders?: AppliedSort[]
  search?: string
}) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [currentTenant?.id, 'customers', filters],
    queryFn: async (): Promise<Customer[]> => {
      if (!currentTenant?.id) {
        return []
      }

      let query = supabase
        .from('customers')
        .select('*')
        .eq('tenant_id', currentTenant.id)

      filters.forEach((filter) => {
        query = query.filter(filter.field, filter.operator, filter.value)
      })

      // Aplicar filtros
      if (search) {
        query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
      }

      // Aplicar ordenamientos
      orders.forEach((order) => {
        query = query.order(order.field, {
          ascending: order.direction === 'asc',
        })
      })

      const { data, error } = await query

      if (error) {
        throw new Error(`Error al obtener clientes: ${error.message}`)
      }

      return data || []
    },
  })
}
