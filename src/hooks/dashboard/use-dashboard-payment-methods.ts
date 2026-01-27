import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'
import { format } from 'date-fns'

interface DateRange {
  from: Date
  to: Date
}

interface UseDashboardPaymentMethodsParams {
  dateRange?: DateRange
}

export function useDashboardPaymentMethods({
  dateRange,
}: UseDashboardPaymentMethodsParams) {
  const { currentTenant } = useCurrentTenantStore()

  const startDate = dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : ''
  const endDate = dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : ''

  return useQuery({
    queryKey: [
      'dashboard-payment-methods',
      currentTenant?.id,
      startDate,
      endDate,
    ],
    queryFn: async () => {
      if (!currentTenant?.id || !startDate || !endDate) return []

      const { data, error } = await supabase
        .from('payments')
        .select(
          `
          amount,
          payment_methods (
            name,
            payment_type
          )
        `
        )
        .eq('tenant_id', currentTenant.id)
        .gte('payment_date', startDate)
        .lte('payment_date', endDate)

      if (error) throw error
      return data
    },
    enabled: !!currentTenant?.id && !!startDate && !!endDate,
  })
}
