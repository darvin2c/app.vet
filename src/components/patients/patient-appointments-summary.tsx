'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Calendar, Clock, User, ArrowRight } from 'lucide-react'
import {
  usePatientNextAppointment,
  usePatientAppointments,
} from '@/hooks/patients/use-patient-appointments'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'

interface PatientAppointmentsSummaryProps {
  patientId: string
}

export function PatientAppointmentsSummary({
  patientId,
}: PatientAppointmentsSummaryProps) {
  const { data: nextAppointment, isLoading: loadingNext } =
    usePatientNextAppointment(patientId)
  const { data: appointments, isLoading: loadingAll } =
    usePatientAppointments(patientId)

  // Obtener las últimas 3 citas
  const recentAppointments = appointments?.slice(0, 3) || []

  if (loadingNext || loadingAll) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Próxima Cita
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Últimas Citas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Próxima cita */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Próxima Cita
          </CardTitle>
        </CardHeader>
        <CardContent>
          {nextAppointment ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {format(
                      new Date(nextAppointment.start_time),
                      'EEEE, dd MMMM yyyy',
                      { locale: es }
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(nextAppointment.start_time), 'HH:mm', {
                      locale: es,
                    })}
                  </p>
                </div>
                <Badge variant="default">
                  {nextAppointment.status === 'scheduled'
                    ? 'Programada'
                    : nextAppointment.status}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {nextAppointment.staff ? (
                      <>
                        Dr. {nextAppointment.staff.first_name}{' '}
                        {nextAppointment.staff.last_name}
                      </>
                    ) : (
                      'Sin asignar'
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {nextAppointment.procedures?.name ||
                      'Procedimiento no especificado'}
                  </span>
                  {nextAppointment.procedures?.base_price && (
                    <span className="text-muted-foreground">
                      (${nextAppointment.procedures.base_price})
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No hay citas programadas</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Últimas citas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Últimas Citas
          </CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/patients/${patientId}/appointments`}>
              Ver todas
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentAppointments.length > 0 ? (
            <div className="space-y-3">
              {recentAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {format(
                        new Date(appointment.start_time),
                        'dd/MM/yyyy HH:mm',
                        { locale: es }
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {appointment.procedures?.name ||
                        'Procedimiento no especificado'}
                    </p>
                  </div>
                  <Badge
                    variant={
                      appointment.status === 'completed'
                        ? 'default'
                        : appointment.status === 'cancelled'
                          ? 'destructive'
                          : 'secondary'
                    }
                  >
                    {appointment.status === 'completed'
                      ? 'Completada'
                      : appointment.status === 'cancelled'
                        ? 'Cancelada'
                        : appointment.status === 'scheduled'
                          ? 'Programada'
                          : appointment.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No hay citas registradas</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
