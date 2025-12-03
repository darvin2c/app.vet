'use client'

import { useQuery } from '@tanstack/react-query'
import { MetricCard } from './metric-card'
import { supabase } from '@/lib/supabase/client'
import {
  subDays,
  differenceInDays,
  parseISO,
  format,
  eachDayOfInterval,
  isSameDay,
} from 'date-fns'

export function AppointmentKpi({
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
    queryKey: ['appointments', startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .gte('scheduled_start', startDate)
        .lte('scheduled_start', endDate)
      if (error) throw error
      return data
    },
  })

  const prevRangeQuery = useQuery({
    queryKey: ['appointments', prevStartDate, prevEndDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .gte('scheduled_start', prevStartDate)
        .lte('scheduled_start', prevEndDate)
      if (error) throw error
      return data
    },
  })

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
