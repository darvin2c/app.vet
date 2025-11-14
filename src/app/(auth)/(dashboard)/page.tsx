'use client'

import PageBase from '@/components/page-base'
import { SearchInput } from '@/components/ui/search-input'
import { ButtonGroup } from '@/components/ui/button-group'
import { Filters } from '@/components/ui/filters'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { FilterConfig } from '@/components/ui/filters'
import {
  DashboardActivityList,
  KpiGrid,
  VisitorsChart,
  GenderDonut,
  TopProductsTable,
} from '@/components/dashboard'

export default function DashboardPage() {
  const filters: FilterConfig[] = [
    {
      field: 'from_date',
      label: 'Desde',
      operator: 'gte',
      placeholder: 'Fecha inicial',
    },
    {
      field: 'to_date',
      label: 'Hasta',
      operator: 'lte',
      placeholder: 'Fecha final',
    },
  ]

  const activities = [
    {
      id: 'a1',
      title: 'Nueva cita creada',
      description: 'Consulta general para paciente Max',
      date: '2025-11-10',
      status: 'success' as const,
    },
    {
      id: 'a2',
      title: 'Pago registrado',
      description: 'Orden #10234 por S/. 180.00',
      date: '2025-11-11',
      status: 'success' as const,
    },
    {
      id: 'a3',
      title: 'Cita reprogramada',
      description: 'Paciente Luna, cambio de horario',
      date: '2025-11-12',
      status: 'warning' as const,
    },
  ]

  return (
    <PageBase
      title="Dashboard"
      subtitle="Resumen operativo del día"
      search={
        <SearchInput
          hasSidebarTriggerLeft
          placeholder="Buscar en actividad..."
          size="lg"
          suffix={
            <ButtonGroup>
              <Filters filters={filters} triggerProps={{ variant: 'ghost' }} />
            </ButtonGroup>
          }
        />
      }
    >
      <div className="space-y-6">
        <KpiGrid
          items={[
            {
              label: 'Ingresos',
              value: 9542,
              delta: { value: 12.5, direction: 'up' },
              helper: 'Últimos 30 días',
              sparkline: [9, 12, 10, 13, 11, 15, 14, 18, 16, 20],
            },
            {
              label: 'Nuevos clientes',
              value: 1234,
              delta: { value: 20, direction: 'down' },
              helper: 'Periodo actual',
              sparkline: [180, 150, 160, 140, 130, 120, 110, 115, 118, 112],
            },
            {
              label: 'Cuentas activas',
              value: 45678,
              delta: { value: 12.5, direction: 'up' },
              helper: 'Retención estable',
              sparkline: [
                45000, 45200, 45350, 45400, 45550, 45600, 45650, 45700, 45750,
                45800,
              ],
            },
            {
              label: 'Tasa de crecimiento',
              value: 4.5,
              delta: { value: 4.5, direction: 'up' },
              helper: 'Proyección mensual',
              sparkline: [3.5, 3.6, 3.9, 4.1, 4.0, 4.2, 4.3, 4.5, 4.4, 4.6],
            },
          ]}
        />
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="performance">Rendimiento</TabsTrigger>
            <TabsTrigger value="products">Productos</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <VisitorsChart />
              <GenderDonut />
            </div>
            <DashboardActivityList activities={activities} />
          </TabsContent>
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <VisitorsChart />
              <GenderDonut />
            </div>
          </TabsContent>
          <TabsContent value="products" className="space-y-6">
            <TopProductsTable />
          </TabsContent>
        </Tabs>
      </div>
    </PageBase>
  )
}
