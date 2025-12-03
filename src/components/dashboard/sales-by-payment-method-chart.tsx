'use client'

import { useMemo, useState } from 'react'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Pie, PieChart, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '../ui/skeleton'
import { subDays, format, startOfToday } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { DateRangePicker } from '@/components/ui/date-range-picker'

export function SalesByPaymentMethodChart() {
  const today = startOfToday()
  const defaultFrom = subDays(today, 30)
  const defaultTo = today

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: defaultFrom,
    to: defaultTo,
  })

  const startDate = dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : ''
  const endDate = dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : ''

  const query = useQuery({
    queryKey: ['sales-by-payment-method', startDate, endDate],
    queryFn: async () => {
      if (!startDate || !endDate) return []
      const { data, error } = await supabase
        .from('payments')
        .select(
          `
          amount,
          payment_methods (
            name,
            payment_type
          )
        `
        )
        .gte('payment_date', startDate)
        .lte('payment_date', endDate)

      if (error) throw error
      return data
    },
    enabled: !!startDate && !!endDate,
  })

  const { typesData, methodsData, totalSales } = useMemo(() => {
    if (!query.data) return { typesData: [], methodsData: [], totalSales: 0 }

    const typesMap = new Map<string, number>()
    const methodsMap = new Map<string, number>()
    let total = 0

    query.data.forEach((payment) => {
      const amount = payment.amount
      const method = payment.payment_methods
      const typeName = method?.payment_type || 'Otros'
      const methodName = method?.name || 'Desconocido'

      typesMap.set(typeName, (typesMap.get(typeName) || 0) + amount)
      methodsMap.set(methodName, (methodsMap.get(methodName) || 0) + amount)
      total += amount
    })

    // Ordenar datos por valor descendente
    const sortedTypes = Array.from(typesMap.entries())
      .map(([name, value]) => ({ name: formatLabel(name), value }))
      .sort((a, b) => b.value - a.value)

    const sortedMethods = Array.from(methodsMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    // Paleta base: Color Primary (el más oscuro)
    // Generaremos variaciones de opacidad/luminosidad basándonos en el índice y el total de elementos.
    // Elemento 0 (Mayor valor) -> Color base con mucha luminosidad/baja opacidad (más claro)
    // Elemento N (Menor valor) -> Color base (más oscuro/intenso)

    const generateColor = (index: number, total: number) => {
      // Si solo hay un elemento, usamos el color base
      if (total <= 1) return 'var(--chart-5)'

      // Lógica invertida:
      // Elemento más grande (index 0) -> Más claro (factor 0.8)
      // Elemento más pequeño (index N) -> Más oscuro (factor 0)
      const lightnessFactor = 0.8 - (index / (total - 1)) * 0.8

      // Usamos color-mix para mezclar el color base con blanco
      // El porcentaje es la cantidad de blanco
      return `color-mix(in srgb, var(--chart-5), white ${lightnessFactor * 100}%)`
    }

    const typesData = sortedTypes.map((item, index) => ({
      ...item,
      fill: generateColor(index, sortedTypes.length),
    }))

    const methodsData = sortedMethods.map((item, index) => ({
      ...item,
      fill: generateColor(index, sortedMethods.length),
    }))

    return { typesData, methodsData, totalSales: total }
  }, [query.data])

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
            Métodos de Pago
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
            amount: {
              label: 'Monto',
              color: 'var(--primary)',
            },
          }}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            {/* Outer Pie: Payment Types (Ring) */}
            <Pie
              data={typesData}
              dataKey="value"
              nameKey="name"
              innerRadius={90}
              outerRadius={110}
              strokeWidth={2}
            >
              {typesData.map((entry, index) => (
                <Cell
                  key={`cell-outer-${index}`}
                  fill={entry.fill}
                  opacity={0.8}
                />
              ))}
            </Pie>
            {/* Inner Pie: Payment Methods (Full Pie) */}
            <Pie
              data={methodsData}
              dataKey="value"
              nameKey="name"
              innerRadius={0}
              outerRadius={70}
              strokeWidth={2}
            >
              {methodsData.map((entry, index) => (
                <Cell key={`cell-inner-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
          </PieChart>
        </ChartContainer>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="mb-2 font-semibold text-muted-foreground">
              Métodos
            </h4>
            <div className="flex flex-wrap gap-2">
              {methodsData.map((method, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <div
                    className="h-3 w-3 rounded-full shrink-0 border border-border/50"
                    style={{ backgroundColor: method.fill }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {method.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-muted-foreground">Tipos</h4>
            <div className="flex flex-wrap gap-2">
              {typesData.map((type, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <div
                    className="h-3 w-3 rounded-full shrink-0 border border-border/50"
                    style={{ backgroundColor: type.fill }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {type.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function formatLabel(str: string) {
  return str.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
}
