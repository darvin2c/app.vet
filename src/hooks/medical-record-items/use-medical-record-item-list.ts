import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'
import { AppliedFilter } from '@/types/filters.types'
import { AppliedSort } from '@/types/order-by.types'

export function useMedicalRecordItemList({
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
      'medical_record_items',
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
        .from('record_items')
        .select('*')
        .eq('tenant_id', currentTenant.id)

      // Apply filters
      filters.forEach((filter) => {
        switch (filter.field) {
          case 'clinical_record_id':
            query = query.eq('clinical_record_id', filter.value)
            break
          default:
            break
        }
      })

      // Apply search
      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
      }

      // Apply sorting
      orders.forEach((order) => {
        query = query.order(order.field, { ascending: order.ascending })
      })

      const { data, error } = await query

      if (error) {
        throw error
      }

      return data || []
    },
    enabled: !!currentTenant?.id,
  })
}
