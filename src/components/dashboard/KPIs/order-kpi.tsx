'use client'
import { useQuery } from '@tanstack/react-query'
import { MetricCard } from './metric-card'
import { supabase } from '@/lib/supabase/client'
import { parseISO, format, eachDayOfInterval, isSameDay } from 'date-fns'

export function OrderKpi({
  dateRange,
  prevRange,
}: {
  dateRange: { from: Date; to: Date }
  prevRange: { from: Date; to: Date }
}) {
  const startDate = format(dateRange.from, 'yyyy-MM-dd')
  const endDate = format(dateRange.to, 'yyyy-MM-dd')
  const prevStartDate = format(prevRange.from, 'yyyy-MM-dd')
  const prevEndDate = format(prevRange.to, 'yyyy-MM-dd')

  const selectRangeQuery = useQuery({
    queryKey: ['orders', startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', startDate)
        .lte('created_at', endDate)
      if (error) throw error
      return data
    },
  })

  const prevRangeQuery = useQuery({
    queryKey: ['orders', prevStartDate, prevEndDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', prevStartDate)
        .lte('created_at', prevEndDate)
      if (error) throw error
      return data
    },
  })

  const isPending = selectRangeQuery.isPending || prevRangeQuery.isPending

  const currentTotal =
    selectRangeQuery.data?.reduce((acc, cur) => acc + cur.total, 0) || 0
  const prevTotal =
    prevRangeQuery.data?.reduce((acc, cur) => acc + cur.total, 0) || 0

  // Sparkline logic: Totales diarios para el periodo actual
  const days = eachDayOfInterval({ start: dateRange.from, end: dateRange.to })
  const sparkline = days.map((day) => {
    const dayOrders =
      selectRangeQuery.data?.filter(
        (order) =>
          order.created_at && isSameDay(parseISO(order.created_at), day)
      ) || []
    return dayOrders.reduce((acc, cur) => acc + cur.total, 0)
  })

  // Delta logic
  const diff = currentTotal - prevTotal
  const percentage =
    prevTotal === 0 ? (currentTotal > 0 ? 100 : 0) : (diff / prevTotal) * 100

  return (
    <MetricCard
      isPending={isPending}
      label="Órdenes de Compra"
      value={currentTotal}
      delta={{
        value: Math.abs(Math.round(percentage * 10) / 10),
        direction: percentage >= 0 ? 'up' : 'down',
      }}
      helper={`vs. periodo anterior (${diff >= 0 ? '+' : ''}S/ ${diff.toLocaleString('es-PE')})`}
      sparkline={sparkline}
    />
  )
}
