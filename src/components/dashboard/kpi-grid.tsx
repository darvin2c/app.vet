'use client'

import { MetricCard } from './metric-card'

type KPI = {
  label: string
  value: number
  delta?: { value: number; direction: 'up' | 'down' }
  helper?: string
  sparkline?: number[]
}

export function KpiGrid({ items }: { items: KPI[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((k) => (
        <MetricCard
          key={k.label}
          label={k.label}
          value={k.value}
          delta={k.delta}
          helper={k.helper}
          sparkline={k.sparkline}
        />
      ))}
    </div>
  )
}
