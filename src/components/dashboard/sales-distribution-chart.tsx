'use client'

import { useMemo, useState, useEffect } from 'react'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Pie, PieChart, Cell, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '../ui/skeleton'
import {
  subDays,
  format,
  startOfToday,
  differenceInDays,
  isValid,
} from 'date-fns'
import { DateRange } from 'react-day-picker'
import { DateRangePicker } from '@/components/ui/date-range-picker'

export function SalesDistributionChart() {
  const today = startOfToday()
  const defaultFrom = subDays(today, 30)
  const defaultTo = today

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: defaultFrom,
    to: defaultTo,
  })

  const startDate = dateRange?.from
    ? format(dateRange.from, 'yyyy-MM-dd')
    : ''
  const endDate = dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : ''

  const query = useQuery({
    queryKey: ['sales-distribution', startDate, endDate],
    queryFn: async () => {
      if (!startDate || !endDate) return []
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          total,
          orders!inner(created_at),
          products(is_service)
        `)
        .gte('orders.created_at', startDate)
        .lte('orders.created_at', endDate)

      if (error) throw error
      return data
    },
    enabled: !!startDate && !!endDate,
  })

  const chartData = useMemo(() => {
    if (!query.data) return []

    let servicesTotal = 0
    let productsTotal = 0

    query.data.forEach((item) => {
      const isService = item.products?.is_service
      const total = item.total || 0

      if (isService) {
        servicesTotal += total
      } else {
        productsTotal += total
      }
    })

    return [
      { name: 'Servicios', value: servicesTotal, color: 'hsl(var(--chart-2))' },
      { name: 'Productos', value: productsTotal, color: 'hsl(var(--chart-1))' },
    ].filter((item) => item.value > 0)
  }, [query.data])

  const totalSales = chartData.reduce((acc, curr) => acc + curr.value, 0)

  if (query.isPending) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-[100px] h-8" />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <Skeleton className="aspect-square w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">
            Distribución de Ventas
          </CardTitle>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">
              S/{' '}
              {totalSales.toLocaleString('es-PE', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
        <div className="w-full sm:w-[240px]">
          <DateRangePicker date={dateRange} onDateChange={setDateRange} />
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={{
            servicios: {
              label: 'Servicios',
              color: 'hsl(var(--chart-2))',
            },
            productos: {
              label: 'Productos',
              color: 'hsl(var(--chart-1))',
            },
          }}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Legend />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
