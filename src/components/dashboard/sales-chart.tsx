'use client'

import { useMemo, useState } from 'react'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type Point = { date: string; value: number }

function generateData(days: number): Point[] {
  const out: Point[] = []
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    // Generate random sales data
    const v = Math.max(
      100,
      Math.round(1000 + Math.sin(i / 3) * 500 + Math.random() * 200)
    )
    out.push({
      date: d.toLocaleDateString('es-PE', { month: 'short', day: 'numeric' }),
      value: v,
    })
  }
  return out
}

export function SalesChart() {
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('30d')
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90
  const data = useMemo(() => generateData(days), [days])

  const totalSales = data.reduce((acc, curr) => acc + curr.value, 0)

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">Ventas Totales</CardTitle>
          <p className="text-2xl font-bold">
            S/ {totalSales.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-muted-foreground">
            +12.5% respecto al periodo anterior
          </p>
        </div>
        <div className="flex items-center gap-2">
           <Select value={range} onValueChange={(v) => setRange(v as any)}>
            <SelectTrigger className="w-[100px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 días</SelectItem>
              <SelectItem value="30d">30 días</SelectItem>
              <SelectItem value="90d">3 meses</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <ChartContainer
          config={{
            sales: { label: 'Ventas', color: 'hsl(var(--primary))' },
          }}
          className="aspect-[4/2] w-full"
        >
          <AreaChart data={data} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-sales)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-sales)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
                dataKey="date" 
                tickLine={false} 
                axisLine={false} 
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => value}
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
