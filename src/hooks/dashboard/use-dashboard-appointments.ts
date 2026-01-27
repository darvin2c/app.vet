import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'
import { format } from 'date-fns'

interface DateRange {
  from: Date
  to: Date
}

interface UseDashboardAppointmentsParams {
  dateRange?: DateRange
  prevRange?: DateRange
}

export function useDashboardAppointments({
  dateRange,
  prevRange,
}: UseDashboardAppointmentsParams) {
  const { currentTenant } = useCurrentTenantStore()

  const startDate = dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : ''
  const endDate = dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : ''
  const prevStartDate = prevRange?.from
    ? format(prevRange.from, 'yyyy-MM-dd')
    : ''
  const prevEndDate = prevRange?.to ? format(prevRange.to, 'yyyy-MM-dd') : ''

  const currentQuery = useQuery({
    queryKey: ['dashboard-appointments', currentTenant?.id, startDate, endDate],
    queryFn: async () => {
      if (!currentTenant?.id || !startDate || !endDate) return []

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('tenant_id', currentTenant.id)
        .gte('scheduled_start', startDate)
        .lte('scheduled_start', endDate)

      if (error) throw error
      return data
    },
    enabled: !!currentTenant?.id && !!startDate && !!endDate,
  })

  const prevQuery = useQuery({
    queryKey: [
      'dashboard-appointments',
      currentTenant?.id,
      prevStartDate,
      prevEndDate,
    ],
    queryFn: async () => {
      if (!currentTenant?.id || !prevStartDate || !prevEndDate) return []

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('tenant_id', currentTenant.id)
        .gte('scheduled_start', prevStartDate)
        .lte('scheduled_start', prevEndDate)

      if (error) throw error
      return data
    },
    enabled:
      !!currentTenant?.id && !!prevStartDate && !!prevEndDate && !!prevRange,
  })

  return {
    currentQuery,
    prevQuery,
  }
}
