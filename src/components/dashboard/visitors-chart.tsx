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

type Point = { date: string; value: number }

function generateData(days: number): Point[] {
  const out: Point[] = []
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    const v = Math.max(
      5,
      Math.round(20 + Math.sin(i / 3) * 15 + Math.random() * 10)
    )
    out.push({
      date: d.toLocaleDateString('es-PE', { month: 'short', day: 'numeric' }),
      value: v,
    })
  }
  return out
}

export function VisitorsChart() {
  const [range, setRange] = useState<'7d' | '30d' | '3m'>('30d')
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90
  const data = useMemo(() => generateData(days), [days])

  return (
    <Card className="shadow-none">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Visitantes</CardTitle>
          <ToggleGroup
            type="single"
            value={range}
            onValueChange={(v) => v && setRange(v as any)}
          >
            <ToggleGroupItem value="3m">3m</ToggleGroupItem>
            <ToggleGroupItem value="30d">30d</ToggleGroupItem>
            <ToggleGroupItem value="7d">7d</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            visitors: { label: 'Visitantes', color: 'var(--primary)' },
          }}
          className="aspect-[3/1]"
        >
          <AreaChart data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Area
              type="monotone"
              dataKey="value"
              fill="var(--color-visitors)"
              stroke="var(--color-visitors)"
            />
            <ChartTooltip
              content={<ChartTooltipContent nameKey="visitors" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
