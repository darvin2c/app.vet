import { Calendar, Clock, User, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tables } from '@/types/supabase.types'
import { PetEmptyState } from './pet-empty-state'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { AppointmentCreateButton } from '@/components/appointments/appointment-create-button'
import { AppointmentActions } from '@/components/appointments/appointment-actions'

type PetAppointment = Tables<'appointments'> & {
  appointment_types: Tables<'appointment_types'> | null
  staff: Tables<'staff'> | null
}

interface PetAppointmentsListProps {
  appointments: PetAppointment[]
  isLoading?: boolean
  petId: string
}

export function PetAppointmentsList({
  appointments,
  isLoading,
  petId,
}: PetAppointmentsListProps) {
  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
      case 'programada':
        return 'default'
      case 'confirmed':
      case 'confirmada':
        return 'secondary'
      case 'in_progress':
      case 'en_progreso':
        return 'outline'
      case 'completed':
      case 'completada':
        return 'secondary'
      case 'cancelled':
      case 'cancelada':
        return 'destructive'
      case 'no_show':
      case 'no_asistio':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return 'Programada'
      case 'confirmed':
        return 'Confirmada'
      case 'in_progress':
        return 'En Progreso'
      case 'completed':
        return 'Completada'
      case 'cancelled':
        return 'Cancelada'
      case 'no_show':
        return 'No Asistió'
      default:
        return status || 'Sin estado'
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Historial de Citas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (appointments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Historial de Citas
            </CardTitle>
            <AppointmentCreateButton petId={petId} />
          </div>
        </CardHeader>
        <CardContent>
          <PetEmptyState
            icon={<Calendar className="h-12 w-12" />}
            title="No hay citas registradas"
            description="Esta mascota aún no tiene citas programadas o completadas."
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Historial de Citas ({appointments.length})
          </CardTitle>
          <AppointmentCreateButton petId={petId} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="border rounded-lg p-4 hover:bg-muted/50 transition-colors relative"
            >
              <div className="absolute top-2 right-2">
                {/* TODO: Crear PetAppointmentActions específico para citas de mascotas */}
              </div>

              <div className="flex items-start justify-between mb-3 pr-8">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">
                      {appointment.appointment_types?.name || 'Cita General'}
                    </h4>
                    <Badge variant={getStatusVariant(appointment.status || '')}>
                      {getStatusText(appointment.status || '')}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {appointment.scheduled_start
                          ? format(
                              new Date(appointment.scheduled_start),
                              'dd/MM/yyyy',
                              { locale: es }
                            )
                          : 'Fecha no especificada'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {appointment.scheduled_start
                          ? format(
                              new Date(appointment.scheduled_start),
                              'HH:mm',
                              { locale: es }
                            )
                          : 'Hora no especificada'}
                      </span>
                    </div>

                    {appointment.staff && (
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{appointment.staff.full_name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {appointment.notes && (
                <div className="text-sm text-muted-foreground bg-muted/30 p-2 rounded">
                  <strong>Notas:</strong> {appointment.notes}
                </div>
              )}

              {appointment.appointment_types?.description && (
                <div className="text-sm text-muted-foreground mt-2">
                  {appointment.appointment_types.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
