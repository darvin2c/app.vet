'use client'

import {
  Clock,
  User,
  UserCheck,
  Stethoscope,
  MoreHorizontal,
  Calendar,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { es } from 'date-fns/locale'
import { format } from 'date-fns'
import { getStaffFullName } from '@/lib/staff-utils'
import { cn } from '@/lib/utils'
import { AppointmentWithRelations } from '@/types/appointment.types'

// Tipo para el appointment con relaciones
type Appointment = AppointmentWithRelations

// Mapeo de estados a variantes de Badge
const STATUS_VARIANTS = {
  scheduled: 'outline',
  confirmed: 'default',
  in_progress: 'secondary',
  completed: 'default',
  cancelled: 'destructive',
  no_show: 'destructive',
} as const

// Etiquetas de estado en español
const STATUS_LABELS = {
  scheduled: 'Programada',
  confirmed: 'Confirmada',
  in_progress: 'En Progreso',
  completed: 'Completada',
  cancelled: 'Cancelada',
  no_show: 'No Asistió',
} as const

interface AppointmentItemProps {
  appointment: Appointment
  onEdit?: (appointment: Appointment) => void
  onDelete?: (appointment: Appointment) => void
  onView?: (appointment: Appointment) => void
}

export function AppointmentItem({
  appointment,
  onEdit,
  onDelete,
  onView,
}: AppointmentItemProps) {
  // Extraer datos del appointment
  const patient = appointment?.pets
  const staff = appointment?.staff
  const appointmentType = appointment?.appointment_types

  // Formatear fechas
  const startDate = new Date(appointment.scheduled_start)
  const endDate = new Date(appointment.scheduled_end)

  const formattedDate = format(startDate, 'dd MMM yyyy', { locale: es })
  const formattedTime = `${format(startDate, 'HH:mm')} - ${format(endDate, 'HH:mm')}`

  // Color del tipo de cita
  const typeColor = appointmentType?.color || '#6b7280'

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      {/* Indicador de color del tipo de cita */}
      <div
        className="w-full h-1 sm:w-1 sm:h-16 rounded-full flex-shrink-0"
        style={{ backgroundColor: typeColor }}
      />

      {/* Información principal - Lado izquierdo */}
      <div className="flex-shrink-0 min-w-0 sm:w-32">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <Calendar className="h-4 w-4" />
          <span className="font-medium">{formattedDate}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4" />
          <span className="font-medium">{formattedTime}</span>
        </div>
        {appointmentType && (
          <div className="mt-2">
            <Badge
              variant="outline"
              className="text-xs"
              style={{
                borderColor: typeColor,
                color: typeColor,
              }}
            >
              {appointmentType.name}
            </Badge>
          </div>
        )}
      </div>

      {/* Información central - Paciente y personal */}
      <div className="flex-1 min-w-0">
        {/* Información del paciente */}
        <div className="flex items-center gap-2 mb-2">
          <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">
              {patient ? patient.name : 'Paciente no asignado'}
            </p>
          </div>
        </div>

        {/* Información del personal médico */}
        {staff && (
          <div className="flex items-center gap-2 mb-2">
            <UserCheck className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <p className="text-sm text-muted-foreground truncate">
              Dr. {getStaffFullName(staff)}
            </p>
          </div>
        )}

        {/* Tipo de cita */}
        {appointmentType && (
          <div className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <p className="text-sm text-muted-foreground truncate">
              {appointmentType.name}
            </p>
          </div>
        )}
      </div>

      {/* Estado y acciones - Lado derecho */}
      <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0 w-full sm:w-auto">
        {/* Estado */}
        <Badge
          variant={STATUS_VARIANTS[appointment.status] || 'outline'}
          className="whitespace-nowrap"
        >
          {STATUS_LABELS[appointment.status] || appointment.status}
        </Badge>

        {/* Menú de acciones */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onView && (
              <DropdownMenuItem onClick={() => onView(appointment)}>
                Ver detalles
              </DropdownMenuItem>
            )}
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(appointment)}>
                Editar cita
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                onClick={() => onDelete(appointment)}
                className="text-destructive"
              >
                Cancelar cita
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
