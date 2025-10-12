'use client'

import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TreatmentPlanSummary } from '@/components/treatment_plans/treatment-plan-summary'
import { TreatmentPlanActions } from '@/components/treatment_plans/treatment-plan-actions'
import { TreatmentPlanAcceptance } from '@/components/treatment_plans/treatment-plan-acceptance'
import { TreatmentPlanStatusBadge } from '@/components/treatment_plans/treatment-plan-status-badge'
import { TreatmentPlanItemEdit } from '@/components/treatment_plans/treatment-plan-item-edit'
import { TreatmentPlanItemDelete } from '@/components/treatment_plans/treatment-plan-item-delete'
import useTreatmentPlanDetail from '@/hooks/treatment-plans/use-treatment-plan-detail'
import { formatCurrency } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  ArrowLeft,
  User,
  UserCheck,
  Calendar,
  FileText,
  DollarSign,
  Clock,
  Edit,
  Trash2,
  Plus,
} from 'lucide-react'
import Link from 'next/link'

export default function TreatmentPlanDetailPage() {
  const params = useParams()
  const treatmentPlanId = params.id as string

  const {
    data: treatmentPlan,
    isLoading,
    error,
    refetch,
  } = useTreatmentPlanDetail(treatmentPlanId)

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (error || !treatmentPlan) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              {error
                ? 'Error al cargar el plan de tratamiento'
                : 'Plan de tratamiento no encontrado'}
            </p>
            <Button asChild className="mt-4">
              <Link href="/treatment-plans">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Planes
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const patient = (treatmentPlan as any).patients
  const staff = (treatmentPlan as any).staff
  const items = (treatmentPlan as any).treatment_plan_items || []

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/treatment-plans">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{treatmentPlan.title}</h1>
            <p className="text-muted-foreground">
              Plan de tratamiento #{treatmentPlan.id.slice(-8)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TreatmentPlanStatusBadge status={treatmentPlan.status as any} />
          <TreatmentPlanActions treatmentPlan={treatmentPlan} />
        </div>
      </div>

      {/* Información Básica */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Información General
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Paciente */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Paciente</span>
              </div>
              {patient && (
                <div className="ml-6">
                  <p className="font-medium">
                    {patient.first_name} {patient.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {patient.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {patient.phone}
                  </p>
                </div>
              )}
            </div>

            {/* Staff Responsable */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Responsable</span>
              </div>
              {staff && (
                <div className="ml-6">
                  <p className="font-medium">
                    {staff.first_name} {staff.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">{staff.email}</p>
                </div>
              )}
            </div>

            {/* Fechas */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Fechas</span>
              </div>
              <div className="ml-6 space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Creado:</span>{' '}
                  {format(new Date((treatmentPlan as any).created_at), 'PPP', {
                    locale: es,
                  })}
                </p>
                {(treatmentPlan as any).proposed_at && (
                  <p className="text-sm">
                    <span className="font-medium">Propuesto:</span>{' '}
                    {format(
                      new Date((treatmentPlan as any).proposed_at),
                      'PPP',
                      {
                        locale: es,
                      }
                    )}
                  </p>
                )}
                {(treatmentPlan as any).accepted_at && (
                  <p className="text-sm">
                    <span className="font-medium">Aceptado:</span>{' '}
                    {format(
                      new Date((treatmentPlan as any).accepted_at),
                      'PPP',
                      {
                        locale: es,
                      }
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* Totales */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Costos</span>
              </div>
              <div className="ml-6 space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Total:</span>{' '}
                  {formatCurrency((treatmentPlan as any).total_cost || 0)}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Aceptado:</span>{' '}
                  {formatCurrency((treatmentPlan as any).accepted_cost || 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Notas */}
          {(treatmentPlan as any).notes && (
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium mb-2">Notas</h4>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                {(treatmentPlan as any).notes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs de Contenido */}
      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">Resumen</TabsTrigger>
          <TabsTrigger value="procedures">
            Procedimientos ({items.length})
          </TabsTrigger>
          {treatmentPlan.status === 'proposed' && (
            <TabsTrigger value="acceptance">Aceptación</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="summary">
          <TreatmentPlanSummary treatmentPlan={treatmentPlan} />
        </TabsContent>

        <TabsContent value="procedures">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>Procedimientos del Plan</CardTitle>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    No hay procedimientos en este plan
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Comienza agregando el primer procedimiento a este plan de
                    tratamiento usando el botón de acciones en la parte superior
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item: any) => {
                    const procedure = item.procedures
                    return (
                      <Card key={item.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-medium">
                                  {procedure?.name ||
                                    'Procedimiento no encontrado'}
                                </h4>
                                <Badge variant="outline" className="text-xs">
                                  {item.status === 'planned'
                                    ? 'Planificado'
                                    : item.status === 'accepted'
                                      ? 'Aceptado'
                                      : item.status === 'rejected'
                                        ? 'Rechazado'
                                        : item.status === 'scheduled'
                                          ? 'Programado'
                                          : item.status === 'completed'
                                            ? 'Completado'
                                            : item.status === 'cancelled'
                                              ? 'Cancelado'
                                              : item.status}
                                </Badge>
                              </div>

                              {procedure?.code && (
                                <p className="text-sm text-muted-foreground font-mono mb-2">
                                  {procedure.code}
                                </p>
                              )}

                              <div className="grid gap-2 md:grid-cols-4 text-sm">
                                <div>
                                  <span className="font-medium">Cantidad:</span>{' '}
                                  {item.quantity}
                                </div>
                                <div>
                                  <span className="font-medium">
                                    Precio Unit.:
                                  </span>{' '}
                                  {formatCurrency(item.unit_price || 0)}
                                </div>
                                <div>
                                  <span className="font-medium">Total:</span>{' '}
                                  <span className="font-semibold text-green-600">
                                    {formatCurrency(item.total || 0)}
                                  </span>
                                </div>
                              </div>

                              {item.notes && (
                                <div className="mt-3 p-2 bg-muted rounded text-sm">
                                  <span className="font-medium">Notas:</span>{' '}
                                  {item.notes}
                                </div>
                              )}
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center gap-2 ml-4">
                              <TreatmentPlanItemEdit
                                treatmentPlanItem={item}
                                onSuccess={refetch}
                                trigger={
                                  <Button size="sm" variant="outline">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                }
                              />
                              <TreatmentPlanItemDelete
                                item={item}
                                onSuccess={refetch}
                                trigger={
                                  <Button size="sm" variant="outline">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                }
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {treatmentPlan.status === 'proposed' && (
          <TabsContent value="acceptance">
            <TreatmentPlanAcceptance
              treatmentPlan={treatmentPlan}
              onUpdate={refetch}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
