'use client'

import { MetricCard } from './metric-card'
import { parseISO, eachDayOfInterval, isSameDay } from 'date-fns'
import { useDashboardPets } from '@/hooks/dashboard/use-dashboard-pets'

export function PetNewKpi({
  dateRange,
  prevRange,
}: {
  dateRange: { from: Date; to: Date }
  prevRange: { from: Date; to: Date }
}) {
  const { currentQuery: selectRangeQuery, prevQuery: prevRangeQuery } =
    useDashboardPets({ dateRange, prevRange })

  const isPending = selectRangeQuery.isPending || prevRangeQuery.isPending

  // Comparar cantidad de nuevos pacientes
  const currentTotal = selectRangeQuery.data?.length || 0
  const prevTotal = prevRangeQuery.data?.length || 0

  // Sparkline logic: Nuevos pacientes diarios
  const days = eachDayOfInterval({ start: dateRange.from, end: dateRange.to })
  const sparkline = days.map((day) => {
    const dayPets =
      selectRangeQuery.data?.filter(
        (pet) => pet.created_at && isSameDay(parseISO(pet.created_at), day)
      ) || []
    return dayPets.length
  })

  // Delta logic
  const diff = currentTotal - prevTotal
  const percentage =
    prevTotal === 0 ? (currentTotal > 0 ? 100 : 0) : (diff / prevTotal) * 100

  return (
    <MetricCard
      isPending={isPending}
      label="Nuevos Pacientes"
      value={currentTotal}
      delta={{
        value: Math.abs(Math.round(percentage * 10) / 10),
        direction: percentage >= 0 ? 'up' : 'down',
      }}
      helper={`vs. periodo anterior (${diff >= 0 ? '+' : ''}${diff} pacientes)`}
      sparkline={sparkline}
    />
  )
}
