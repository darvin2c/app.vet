'use client'

import { useMemo, useState } from 'react'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Pie, PieChart, Cell, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '../ui/skeleton'
import { subDays, startOfToday } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { useDashboardSalesDistribution } from '@/hooks/dashboard/use-dashboard-sales-distribution'

export function SalesDistributionChart() {
  const today = startOfToday()
  const defaultFrom = subDays(today, 30)
  const defaultTo = today

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: defaultFrom,
    to: defaultTo,
  })

  const safeDateRange =
    dateRange?.from && dateRange?.to
      ? { from: dateRange.from, to: dateRange.to }
      : undefined

  const query = useDashboardSalesDistribution({ dateRange: safeDateRange })

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
      {
        name: 'Servicios',
        value: servicesTotal,
        color: 'var(--chart-5)',
      },
      { name: 'Productos', value: productsTotal, color: 'var(--chart-1)' },
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
              color: 'var(--chart-5)',
            },
            productos: {
              label: 'Productos',
              color: 'var(--chart-1)',
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
