'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type DashboardMetrics = {
  totalCustomers: number
  totalPets: number
  upcomingAppointments: number
  monthlyRevenue: number
}

export function DashboardSummary({
  metrics = {
    totalCustomers: 0,
    totalPets: 0,
    upcomingAppointments: 0,
    monthlyRevenue: 0,
  },
}: {
  metrics?: DashboardMetrics
}) {
  const items = [
    { label: 'Clientes', value: metrics.totalCustomers },
    { label: 'Pacientes', value: metrics.totalPets },
    { label: 'Citas Próximas', value: metrics.upcomingAppointments },
    { label: 'Ingresos Mensuales', value: metrics.monthlyRevenue },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              {item.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {item.value.toLocaleString('es-PE')}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
