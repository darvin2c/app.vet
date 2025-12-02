'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChartContainer } from '@/components/ui/chart'
import { Area, AreaChart } from 'recharts'
import { useId } from 'react'

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
  const id = useId()
  const formatted = value.toLocaleString('es-PE')
  const deltaText = delta
    ? `${delta.direction === 'up' ? '+' : '-'}${delta.value}%`
    : ''
  const gradientId = `gradient-${id}`

  return (
    <Card className="shadow-none overflow-hidden py-0 gap-0 flex flex-col justify-between">
      <div className="p-6 pb-2">
        <div className="text-sm text-muted-foreground font-medium">{label}</div>
        <div className="flex items-center gap-2 mt-2">
          <div className="text-2xl font-bold">{formatted}</div>
          {delta && (
            <Badge variant={delta.direction === 'up' ? 'default' : 'secondary'}>
              {deltaText}
            </Badge>
          )}
        </div>
        {helper && (
          <div className="mt-1 text-xs text-muted-foreground">{helper}</div>
        )}
      </div>

      {sparkline.length > 0 && (
        <div className="h-16 w-full">
          <ChartContainer
            config={{ s: { color: 'hsl(var(--primary))' } }}
            className="h-full w-full aspect-auto"
          >
            <AreaChart
              data={sparkline.map((v, i) => ({ i, v }))}
              margin={{ left: 0, right: 0, top: 4, bottom: 0 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--color-s)"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-s)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke="var(--color-s)"
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                fillOpacity={1}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      )}
    </Card>
  )
}
