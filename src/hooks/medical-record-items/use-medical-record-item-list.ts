import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'
import { AppliedFilter } from '@/components/ui/filters'
import { AppliedSort } from '@/components/ui/order-by'
import { Tables } from '@/types/supabase.types'

export type MedicalRecordItem = Tables<'record_items'> & {
  products: Tables<'products'> | null
}

export function useMedicalRecordItemList({
  filters = [],
  search,
  orders = [
    {
      field: 'created_at',
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
    queryKey: [currentTenant?.id, 'record_items', filters, search, orders],
    queryFn: async () => {
      if (!currentTenant) {
        return []
      }

      const supabase = createClient()
      let query = supabase
        .from('record_items')
        .select(
          `
          *,
          products(*)
        `
        )
        .eq('tenant_id', currentTenant.id)

      // Apply filters
      filters.forEach((filter) => {
        switch (filter.field) {
          case 'record_id':
            query = query.eq('record_id', filter.value)
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
        query = query.order(order.field, {
          ascending: order.direction === 'asc',
        })
      })

      const { data, error } = await query

      if (error) {
        throw error
      }

      return data || []
    },
    enabled: !!currentTenant,
  })
}
