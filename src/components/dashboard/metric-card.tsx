'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChartContainer } from '@/components/ui/chart'
import { Area, AreaChart } from 'recharts'

type MetricCardProps = {
  label: string
  value: number
  delta?: { value: number; direction: 'up' | 'down' }
  helper?: string
  sparkline?: number[]
}

export function MetricCard({
  label,
  value,
  delta,
  helper,
  sparkline = [],
}: MetricCardProps) {
  const formatted = value.toLocaleString('es-PE')
  const deltaText = delta
    ? `${delta.direction === 'up' ? '+' : '-'}${delta.value}%`
    : ''
  return (
    <Card className="shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <div className="text-2xl font-semibold">{formatted}</div>
          {delta && (
            <Badge variant={delta.direction === 'up' ? 'default' : 'secondary'}>
              {deltaText}
            </Badge>
          )}
        </div>
        {helper && (
          <div className="mt-1 text-xs text-muted-foreground">{helper}</div>
        )}
        {sparkline.length > 0 && (
          <div className="mt-2">
            <ChartContainer
              config={{ s: { color: 'hsl(var(--primary))' } }}
              className="h-12"
            >
              <AreaChart
                data={sparkline.map((v, i) => ({ i, v }))}
                margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
              >
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="var(--color-s)"
                  fill="var(--color-s)"
                />
              </AreaChart>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
