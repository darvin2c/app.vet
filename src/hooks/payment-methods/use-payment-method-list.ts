import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'
import { Tables } from '@/types/supabase.types'
import { AppliedFilter, applySupabaseFilters } from '@/components/ui/filters'
import { AppliedSort } from '@/components/ui/order-by'

type PaymentMethod = Tables<'payment_methods'>

export function usePaymentMethodList({
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
    queryKey: [currentTenant?.id, 'payment_methods', filters, search, orders],
    queryFn: async (): Promise<PaymentMethod[]> => {
      if (!currentTenant?.id) {
        throw new Error('No tenant selected')
      }

      // Build the query
      let query = supabase
        .from('payment_methods')
        .select('*')
        .eq('tenant_id', currentTenant.id)

      // Apply filters
      query = applySupabaseFilters(query, filters)

      // Apply search
      if (search) {
        query = query.textSearch('name', search)
      }

      // Apply orders
      orders.forEach((order) => {
        query = query.order(order.field, {
          ascending: order.direction === 'asc',
        })
      })

      const { data, error } = await query

      if (error) {
        throw error
      }

      return data
    },
    enabled: !!currentTenant?.id,
  })
}
