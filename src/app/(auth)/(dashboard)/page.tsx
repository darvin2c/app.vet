'use client'

import PageBase from '@/components/page-base'
import {
  KpiGrid,
  SalesChart,
  AppointmentsList,
  QuickActions,
} from '@/components/dashboard'
import { CalendarIcon } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function DashboardPage() {
  const kpis = [
    {
      label: 'Ventas Hoy',
      value: 1580,
      delta: { value: 12.5, direction: 'up' as const },
      helper: 'vs. ayer (S/ 1,350)',
      sparkline: [1200, 1300, 1250, 1400, 1350, 1500, 1580],
    },
    {
      label: 'Citas Pendientes',
      value: 12,
      delta: { value: 4, direction: 'down' as const },
      helper: '4 por confirmar',
      sparkline: [15, 14, 16, 13, 12, 12, 12],
    },
    {
      label: 'Pagos Recibidos',
      value: 4250,
      delta: { value: 8.2, direction: 'up' as const },
      helper: '34% en tarjeta',
      sparkline: [3000, 3200, 3500, 3800, 4000, 4100, 4250],
    },
    {
      label: 'Nuevos Pacientes',
      value: 5,
      delta: { value: 2, direction: 'up' as const },
      helper: 'Esta semana',
      sparkline: [1, 2, 1, 3, 2, 4, 5],
    },
  ]

  const headerControls = (
    <div className="flex items-center justify-end gap-2">
      <Select defaultValue="today">
        <SelectTrigger className="w-[140px]">
          <CalendarIcon className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Periodo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Hoy</SelectItem>
          <SelectItem value="week">Esta Semana</SelectItem>
          <SelectItem value="month">Este Mes</SelectItem>
          <SelectItem value="quarter">Este Trimestre</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )

  return (
    <PageBase
      title="Dashboard"
      subtitle="Resumen general de operaciones"
      search={headerControls}
    >
      <div className="space-y-6">
        {/* KPI Cards Row */}
        <KpiGrid items={kpis} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column (Charts) - Spans 2 columns */}
          <div className="space-y-6 lg:col-span-2">
            <QuickActions />
            <SalesChart />
          </div>

          {/* Right Column (Lists) - Spans 1 column */}
          <div className="space-y-6">
            <AppointmentsList />
          </div>
        </div>
      </div>
    </PageBase>
  )
}
