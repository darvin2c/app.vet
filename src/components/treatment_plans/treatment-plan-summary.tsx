'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TreatmentPlanWithRelations } from '@/hooks/treatment-plans/use-treatment-plans'
import { formatCurrency } from '@/lib/utils'
import {
  FileText,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
} from 'lucide-react'

interface TreatmentPlanSummaryProps {
  treatmentPlan: TreatmentPlanWithRelations
}

export function TreatmentPlanSummary({
  treatmentPlan,
}: TreatmentPlanSummaryProps) {
  // Calcular estadísticas de los items
  const items = treatmentPlan.treatment_plan_items || []
  const totalItems = items.length
  const acceptedItems = items.filter(
    (item) => item.status === 'accepted'
  ).length
  const rejectedItems = items.filter(
    (item) => item.status === 'rejected'
  ).length
  const completedItems = items.filter(
    (item) => item.status === 'completed'
  ).length
  const pendingItems = items.filter((item) =>
    ['planned', 'scheduled'].includes(item.status)
  ).length

  // Calcular costos
  const totalCost = treatmentPlan.total || 0
  const acceptedCost = items
    .filter((item) => item.status === 'accepted')
    .reduce((sum, item) => sum + (item.total || 0), 0)
  const completedCost = items
    .filter((item) => item.status === 'completed')
    .reduce((sum, item) => sum + (item.total || 0), 0)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Resumen General */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Procedimientos
          </CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalItems}</div>
          <p className="text-xs text-muted-foreground">
            procedimientos planificados
          </p>
        </CardContent>
      </Card>

      {/* Costo Total */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Costo Total</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalCost)}</div>
          <p className="text-xs text-muted-foreground">
            costo estimado del plan
          </p>
        </CardContent>
      </Card>

      {/* Procedimientos Aceptados */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Aceptados</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {acceptedItems}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatCurrency(acceptedCost)} aprobados
          </p>
        </CardContent>
      </Card>

      {/* Procedimientos Completados */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completados</CardTitle>
          <CheckCircle className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">
            {completedItems}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatCurrency(completedCost)} finalizados
          </p>
        </CardContent>
      </Card>

      {/* Detalles adicionales */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-lg">Estado del Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Pendientes */}
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div>
                <div className="text-sm font-medium">Pendientes</div>
                <div className="text-xs text-muted-foreground">
                  {pendingItems} procedimientos
                </div>
              </div>
            </div>

            {/* Rechazados */}
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <div>
                <div className="text-sm font-medium">Rechazados</div>
                <div className="text-xs text-muted-foreground">
                  {rejectedItems} procedimientos
                </div>
              </div>
            </div>

            {/* Progreso */}
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-sm font-medium">Progreso</div>
                <div className="text-xs text-muted-foreground">
                  {totalItems > 0
                    ? Math.round((completedItems / totalItems) * 100)
                    : 0}
                  % completado
                </div>
              </div>
            </div>

            {/* Aceptación */}
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <div className="text-sm font-medium">Aceptación</div>
                <div className="text-xs text-muted-foreground">
                  {totalItems > 0
                    ? Math.round((acceptedItems / totalItems) * 100)
                    : 0}
                  % aceptado
                </div>
              </div>
            </div>
          </div>

          {/* Barra de progreso visual */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progreso del Plan</span>
              <span>
                {totalItems > 0
                  ? Math.round((completedItems / totalItems) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${totalItems > 0 ? (completedItems / totalItems) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          {/* Información del paciente y responsable */}
          <div className="mt-4 pt-4 border-t grid gap-2 md:grid-cols-2">
            <div>
              <div className="text-sm font-medium">Paciente</div>
              <div className="text-sm text-muted-foreground">
                {treatmentPlan.patients
                  ? `${treatmentPlan.patients.first_name} ${treatmentPlan.patients.last_name}`
                  : 'No asignado'}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Responsable</div>
              <div className="text-sm text-muted-foreground">
                {treatmentPlan.staff
                  ? `${treatmentPlan.staff.first_name} ${treatmentPlan.staff.last_name}`
                  : 'No asignado'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
