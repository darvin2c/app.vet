'use client'

import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { TreatmentPlanCreate } from '@/components/treatment_plans/treatment-plan-create'
import { TreatmentPlanActions } from '@/components/treatment_plans/treatment-plan-actions'
import { TreatmentPlanStatusBadge } from '@/components/treatment_plans/treatment-plan-status-badge'
import usePatientTreatmentPlans from '@/hooks/treatment-plans/use-patient-treatment-plans'
import { usePatientDetail } from '@/hooks/patients/use-patient-detail'
import { formatCurrency } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  ArrowLeft,
  Plus,
  FileText,
  Calendar,
  DollarSign,
  User,
  UserCheck,
  ClipboardList,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function PatientTreatmentPlansPage() {
  const params = useParams()
  const patientId = params.id as string
  const [showCreatePlan, setShowCreatePlan] = useState(false)

  const { data: patient, isLoading: isLoadingPatient } =
    usePatientDetail(patientId)

  const {
    data: treatmentPlans = [],
    isLoading: isLoadingPlans,
    error,
  } = usePatientTreatmentPlans(patientId)

  if (isLoadingPatient || isLoadingPlans) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-32 w-full" />
          <div className="grid gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Error al cargar los planes de tratamiento
            </p>
            <Button asChild className="mt-4">
              <Link href={`/patients/${patientId}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Perfil
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/patients/${patientId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Perfil
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Planes de Tratamiento</h1>
            {patient && (
              <p className="text-muted-foreground">
                {patient.first_name} {patient.last_name}
              </p>
            )}
          </div>
        </div>
        <Button onClick={() => setShowCreatePlan(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Plan
        </Button>
      </div>

      {/* Resumen */}
      {treatmentPlans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Resumen de Planes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {treatmentPlans.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total de Planes
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {
                    treatmentPlans.filter(
                      (plan: any) => plan.status === 'accepted'
                    ).length
                  }
                </div>
                <div className="text-sm text-muted-foreground">Aceptados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">
                  {
                    treatmentPlans.filter(
                      (plan: any) => plan.status === 'proposed'
                    ).length
                  }
                </div>
                <div className="text-sm text-muted-foreground">Propuestos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(
                    treatmentPlans.reduce(
                      (sum: any, plan: any) => sum + (plan.total || 0),
                      0
                    )
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Valor Total</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Planes */}
      {treatmentPlans.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              No hay planes de tratamiento
            </h3>
            <p className="text-muted-foreground mb-4">
              Este paciente aún no tiene planes de tratamiento creados.
            </p>
            <Button onClick={() => setShowCreatePlan(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Primer Plan
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {treatmentPlans.map((plan: any) => {
            const staff = plan.staff
            const itemsCount = plan.treatment_plan_items?.length || 0
            const acceptedItems =
              plan.treatment_plan_items?.filter(
                (item: any) => item.status === 'accepted'
              ).length || 0

            return (
              <Card key={plan.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <CardTitle className="text-lg">{plan.title}</CardTitle>
                        <div className="text-sm text-muted-foreground">
                          Plan #{plan.id.slice(-8)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TreatmentPlanStatusBadge status={plan.status as any} />
                      <TreatmentPlanActions treatmentPlan={plan} />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Información básica */}
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Responsable</div>
                        <div className="text-sm text-muted-foreground">
                          {staff
                            ? `${staff.first_name} ${staff.last_name}`
                            : 'No asignado'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Creado</div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(plan.created_at), 'PPP', {
                            locale: es,
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">
                          Procedimientos
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {acceptedItems}/{itemsCount} aceptados
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Costo Total</div>
                        <div className="text-sm font-semibold text-green-600">
                          {formatCurrency(plan.total_cost || 0)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Diagnóstico */}
                  {plan.diagnosis && (
                    <div className="p-3 bg-muted rounded-md">
                      <div className="text-sm font-medium mb-1">
                        Diagnóstico
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {plan.diagnosis}
                      </div>
                    </div>
                  )}

                  {/* Descripción */}
                  {plan.description && (
                    <div className="p-3 bg-blue-50 rounded-md">
                      <div className="text-sm font-medium mb-1">
                        Descripción
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {plan.description}
                      </div>
                    </div>
                  )}

                  {/* Botón para ver detalles */}
                  <div className="pt-3 border-t">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/treatment-plans/${plan.id}`}>
                        Ver Detalles Completos
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Modal de Creación */}
      <TreatmentPlanCreate
        open={showCreatePlan}
        onOpenChange={setShowCreatePlan}
        onSuccess={() => setShowCreatePlan(false)}
        defaultPatientId={patientId}
      />
    </div>
  )
}
