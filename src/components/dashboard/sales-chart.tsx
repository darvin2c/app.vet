'use client'

import { useMemo, useState, useEffect } from 'react'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '../ui/skeleton'
import {
  subDays,
  format,
  startOfToday,
  differenceInDays,
  eachDayOfInterval,
  isSameDay,
  parseISO,
  isValid,
} from 'date-fns'
import { DateRange } from 'react-day-picker'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { es } from 'date-fns/locale'

export function SalesChart() {
  const today = startOfToday()
  const defaultFrom = subDays(today, 30)
  const defaultTo = today

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: defaultFrom,
    to: defaultTo,
  })

  const [prevRange, setPrevRange] = useState<DateRange | undefined>(undefined)

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      if (isValid(dateRange.from) && isValid(dateRange.to)) {
        const daysDiff = differenceInDays(dateRange.to, dateRange.from)
        const prevEnd = subDays(dateRange.from, 1)
        const prevStart = subDays(prevEnd, daysDiff)

        setPrevRange({
          from: prevStart,
          to: prevEnd,
        })
      }
    }
  }, [dateRange])

  const startDate = dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : ''
  const endDate = dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : ''
  const prevStartDate = prevRange?.from
    ? format(prevRange.from, 'yyyy-MM-dd')
    : ''
  const prevEndDate = prevRange?.to ? format(prevRange.to, 'yyyy-MM-dd') : ''

  const query = useQuery({
    queryKey: ['sales', startDate, endDate],
    queryFn: async () => {
      if (!startDate || !endDate) return []
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', startDate)
        .lte('created_at', endDate)
      if (error) throw error
      return data
    },
    enabled: !!startDate && !!endDate,
  })

  const prevQuery = useQuery({
    queryKey: ['sales', prevStartDate, prevEndDate],
    queryFn: async () => {
      if (!prevStartDate || !prevEndDate) return []
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', prevStartDate)
        .lte('created_at', prevEndDate)
      if (error) throw error
      return data
    },
    enabled: !!prevStartDate && !!prevEndDate,
  })

  const currentTotal =
    query.data?.reduce((acc, curr) => acc + curr.total, 0) || 0
  const prevTotal =
    prevQuery.data?.reduce((acc, curr) => acc + curr.total, 0) || 0

  const diff = currentTotal - prevTotal
  const percentage =
    prevTotal === 0 ? (currentTotal > 0 ? 100 : 0) : (diff / prevTotal) * 100

  const chartData = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to || !query.data) return []

    const days = eachDayOfInterval({ start: dateRange.from, end: dateRange.to })
    return days.map((day) => {
      const daySales = query.data.filter(
        (order) =>
          order.created_at && isSameDay(parseISO(order.created_at), day)
      )
      const value = daySales.reduce((acc, curr) => acc + curr.total, 0)
      return {
        date: format(day, 'dd MMM', { locale: es }),
        value,
      }
    })
  }, [dateRange, query.data])

  const isPending = query.isPending || prevQuery.isPending

  if (isPending) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-3 w-40" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-[100px] h-8" />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <Skeleton className="aspect-[4/2] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">
            Ventas Totales
          </CardTitle>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">
              S/{' '}
              {currentTotal.toLocaleString('es-PE', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {diff >= 0 ? '+' : ''}
            {Math.round(percentage * 10) / 10}% respecto al periodo anterior
          </p>
        </div>
        <div className="w-full sm:w-[240px]">
          <DateRangePicker date={dateRange} onDateChange={setDateRange} />
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <ChartContainer
          config={{
            sales: { label: 'Ventas', color: 'var(--chart-5)' },
          }}
          className="aspect-[4/2] w-full"
        >
          <AreaChart
            data={chartData}
            margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-sales)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-sales)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `S/ ${value}`}
              width={60}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--color-sales)"
              fill="url(#fillSales)"
              strokeWidth={2}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => value}
                  indicator="dot"
                />
              }
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
