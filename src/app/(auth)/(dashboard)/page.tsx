'use client'

import PageBase from '@/components/page-base'
import {
  KpiGrid,
  SalesChart,
  SalesDistributionChart,
  SalesByPaymentMethodChart,
  AppointmentsList,
  QuickActions,
} from '@/components/dashboard'

export default function DashboardPage() {
  return (
    <PageBase title="Dashboard" subtitle="Resumen general de operaciones">
      <div className="space-y-6">
        {/* KPI Cards Row */}
        <KpiGrid />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column (Charts) - Spans 2 columns */}
          <div className="space-y-6 lg:col-span-2">
            <QuickActions />
            <SalesChart />
          </div>

          {/* Right Column (Lists) - Spans 1 column */}
          <div className="space-y-6">
            <SalesDistributionChart />
            <SalesByPaymentMethodChart />
            <AppointmentsList />
          </div>
        </div>
      </div>
    </PageBase>
  )
}
