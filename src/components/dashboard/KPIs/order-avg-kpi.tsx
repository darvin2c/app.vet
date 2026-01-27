'use client'

import { MetricCard } from './metric-card'
import { parseISO, eachDayOfInterval, isSameDay } from 'date-fns'
import { useDashboardOrders } from '@/hooks/dashboard/use-dashboard-orders'

export function OrderAvgKpi({
  dateRange,
  prevRange,
}: {
  dateRange: { from: Date; to: Date }
  prevRange: { from: Date; to: Date }
}) {
  const { currentQuery: selectRangeQuery, prevQuery: prevRangeQuery } =
    useDashboardOrders({ dateRange, prevRange })

  const isPending = selectRangeQuery.isPending || prevRangeQuery.isPending

  // Calcular promedios actuales
  const currentData = selectRangeQuery.data || []
  const currentTotalRevenue = currentData.reduce(
    (acc, cur) => acc + cur.total,
    0
  )
  const currentCount = currentData.length
  const currentAvg = currentCount > 0 ? currentTotalRevenue / currentCount : 0

  // Calcular promedios anteriores
  const prevData = prevRangeQuery.data || []
  const prevTotalRevenue = prevData.reduce((acc, cur) => acc + cur.total, 0)
  const prevCount = prevData.length
  const prevAvg = prevCount > 0 ? prevTotalRevenue / prevCount : 0

  // Sparkline logic: Promedio diario para el periodo actual
  const days = eachDayOfInterval({ start: dateRange.from, end: dateRange.to })
  const sparkline = days.map((day) => {
    const dayOrders =
      currentData.filter(
        (order) =>
          order.created_at && isSameDay(parseISO(order.created_at), day)
      ) || []

    const dayRevenue = dayOrders.reduce((acc, cur) => acc + cur.total, 0)
    const dayCount = dayOrders.length
    return dayCount > 0 ? dayRevenue / dayCount : 0
  })

  // Delta logic
  const diff = currentAvg - prevAvg
  const percentage =
    prevAvg === 0 ? (currentAvg > 0 ? 100 : 0) : (diff / prevAvg) * 100

  return (
    <MetricCard
      isPending={isPending}
      label="Ticket Promedio"
      value={currentAvg}
      delta={{
        value: Math.abs(Math.round(percentage * 10) / 10),
        direction: percentage >= 0 ? 'up' : 'down',
      }}
      helper={`vs. periodo anterior (${diff >= 0 ? '+' : ''}S/ ${diff.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`}
      sparkline={sparkline}
    />
  )
}
