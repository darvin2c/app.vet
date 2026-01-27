import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'
import { format } from 'date-fns'

interface DateRange {
  from: Date
  to: Date
}

interface UseDashboardSalesDistributionParams {
  dateRange?: DateRange
}

export function useDashboardSalesDistribution({
  dateRange,
}: UseDashboardSalesDistributionParams) {
  const { currentTenant } = useCurrentTenantStore()

  const startDate = dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : ''
  const endDate = dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : ''

  return useQuery({
    queryKey: [
      'dashboard-sales-distribution',
      currentTenant?.id,
      startDate,
      endDate,
    ],
    queryFn: async () => {
      if (!currentTenant?.id || !startDate || !endDate) return []

      const { data, error } = await supabase
        .from('order_items')
        .select(
          `
          total,
          orders!inner(created_at),
          products(is_service)
        `
        )
        .eq('tenant_id', currentTenant.id)
        .gte('orders.created_at', startDate)
        .lte('orders.created_at', endDate)

      if (error) throw error
      return data
    },
    enabled: !!currentTenant?.id && !!startDate && !!endDate,
  })
}
