'use client'

import {
  Clock,
  User,
  UserCheck,
  Stethoscope,
  MoreHorizontal,
} from 'lucide-react'
import type { Tables } from '@/types/supabase.types'
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

interface AppointmentCardProps {
  appointment: Appointment
  onEdit?: (appointment: Appointment) => void
  onDelete?: (appointment: Appointment) => void
  onView?: (appointment: Appointment) => void
}

export function AppointmentCard({
  appointment,
  onEdit,
  onDelete,
  onView,
}: AppointmentCardProps) {
  // Extraer datos del appointment
  const patient = appointment?.patients
  const staff = appointment?.staff
  const appointmentType = appointment?.appointment_types
  const procedure = appointment?.procedures
  const status = appointment?.status as keyof typeof STATUS_LABELS

  const patientName = patient
    ? `${patient.first_name} ${patient.last_name}`
    : 'Sin paciente'
  const staffName = staff ? `${staff.first_name} ${staff.last_name}` : null
  const typeName = appointmentType?.name || 'Sin tipo'
  const typeColor = appointmentType?.color || '#3b82f6'
  const procedureName = procedure?.name

  // Formatear horas
  const startTime = format(new Date(appointment.start_time), 'HH:mm', {
    locale: es,
  })
  const endTime = format(new Date(appointment.end_time), 'HH:mm', {
    locale: es,
  })
  const timeRange = `${startTime} - ${endTime}`

  // Formatear fecha
  const appointmentDate = format(
    new Date(appointment.start_time),
    'dd/MM/yyyy',
    { locale: es }
  )

  return (
    <div
      className={cn(
        'p-4 rounded-lg border shadow-sm',
        'hover:shadow-md transition-all duration-200 cursor-pointer',
        'bg-opacity-5 relative'
      )}
      style={{
        borderColor: typeColor,
        backgroundColor: `${typeColor}15`, // Fondo con opacidad muy baja
      }}
    >
      {/* Header con título y acciones */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 leading-tight mb-1">
            {typeName}
          </h3>
          <div className="flex items-center gap-2">
            <Badge variant={STATUS_VARIANTS[status] as any} className="text-xs">
              {STATUS_LABELS[status]}
            </Badge>
          </div>
        </div>

        {/* Menú de acciones */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
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
                Editar
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                onClick={() => onDelete(appointment)}
                className="text-destructive"
              >
                Cancelar
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Información del paciente */}
      <div className="flex items-center gap-2 mb-2">
        <User className="w-4 h-4 text-gray-600" />
        <span className="font-medium text-sm text-gray-800">{patientName}</span>
      </div>

      {/* Fecha y horario */}
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-4 h-4 text-gray-600" />
        <div className="text-sm text-gray-700">
          <span className="font-medium">{appointmentDate}</span>
          <span className="mx-2">•</span>
          <span>{timeRange}</span>
        </div>
      </div>

      {/* Personal médico si existe */}
      {staffName && (
        <div className="flex items-center gap-2 mb-2">
          <UserCheck className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-700">{staffName}</span>
        </div>
      )}

      {/* Procedimiento si existe */}
      {procedureName && (
        <div className="flex items-center gap-2 mb-2">
          <Stethoscope className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-700">{procedureName}</span>
        </div>
      )}

      {/* Notas/descripción si existen */}
      {appointment?.notes && (
        <div className="pt-2 mt-2 border-t border-gray-200">
          <p className="text-xs text-gray-600 leading-relaxed">
            {appointment.notes}
          </p>
        </div>
      )}

      {/* Indicador visual para el tipo de cita */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none rounded-lg"
        style={{ backgroundColor: typeColor }}
      />
    </div>
  )
}
