'use client'

type ChartProps = {
  weeklyAppointments?: number[]
  revenueTrend?: number[]
}

export function DashboardCharts({
  weeklyAppointments = [],
  revenueTrend = [],
}: ChartProps) {
  const appts = weeklyAppointments.length
    ? weeklyAppointments
    : [12, 18, 9, 22, 15, 17, 20]
  const revenue = revenueTrend.length
    ? revenueTrend
    : [1200, 1500, 900, 1800, 1400, 1600, 1750]

  const maxA = Math.max(...appts)
  const maxR = Math.max(...revenue)

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="rounded-lg border p-4">
        <div className="mb-2 text-sm font-medium">Citas por semana</div>
        <div className="flex items-end gap-2 h-32">
          {appts.map((v, i) => (
            <div
              key={i}
              className="w-6 bg-blue-500/60"
              style={{ height: `${(v / maxA) * 100}%` }}
              aria-label={`Día ${i + 1}: ${v}`}
            />
          ))}
        </div>
      </div>
      <div className="rounded-lg border p-4">
        <div className="mb-2 text-sm font-medium">Ingresos</div>
        <div className="flex items-end gap-2 h-32">
          {revenue.map((v, i) => (
            <div
              key={i}
              className="w-6 bg-green-500/60"
              style={{ height: `${(v / maxR) * 100}%` }}
              aria-label={`Día ${i + 1}: ${v}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
