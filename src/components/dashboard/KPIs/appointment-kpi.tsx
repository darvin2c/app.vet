'use client'

import { MetricCard } from './metric-card'
import { parseISO, eachDayOfInterval, isSameDay } from 'date-fns'
import { useDashboardAppointments } from '@/hooks/dashboard/use-dashboard-appointments'

export function AppointmentKpi({
  dateRange,
  prevRange,
}: {
  dateRange: { from: Date; to: Date }
  prevRange: { from: Date; to: Date }
}) {
  const { currentQuery: selectRangeQuery, prevQuery: prevRangeQuery } =
    useDashboardAppointments({ dateRange, prevRange })

  const isPending = selectRangeQuery.isPending || prevRangeQuery.isPending

  // En este caso comparamos la CANTIDAD (length) de citas, no la suma de un total
  const currentTotal = selectRangeQuery.data?.length || 0
  const prevTotal = prevRangeQuery.data?.length || 0

  // Sparkline logic: Cantidad de citas diarias para el periodo actual
  const days = eachDayOfInterval({ start: dateRange.from, end: dateRange.to })
  const sparkline = days.map((day) => {
    const dayAppointments =
      selectRangeQuery.data?.filter(
        (appointment) =>
          appointment.scheduled_start &&
          isSameDay(parseISO(appointment.scheduled_start), day)
      ) || []
    return dayAppointments.length // Usamos length para contar citas
  })

  // Delta logic
  const diff = currentTotal - prevTotal
  const percentage =
    prevTotal === 0 ? (currentTotal > 0 ? 100 : 0) : (diff / prevTotal) * 100

  return (
    <MetricCard
      isPending={isPending}
      label="Citas Programadas"
      value={currentTotal}
      delta={{
        value: Math.abs(Math.round(percentage * 10) / 10),
        direction: percentage >= 0 ? 'up' : 'down',
      }}
      helper={`vs. periodo anterior (${diff >= 0 ? '+' : ''}${diff} citas)`}
      sparkline={sparkline}
    />
  )
}
