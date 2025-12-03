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

export function PetNewKpi({
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
    queryKey: ['pets', startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .gte('created_at', startDate)
        .lte('created_at', endDate)
      if (error) throw error
      return data
    },
  })

  const prevRangeQuery = useQuery({
    queryKey: ['pets', prevStartDate, prevEndDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .gte('created_at', prevStartDate)
        .lte('created_at', prevEndDate)
      if (error) throw error
      return data
    },
  })

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
