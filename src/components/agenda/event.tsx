'use client'

import { useIlamyCalendarContext, type CalendarEvent } from '@ilamy/calendar'
import { Clock, User, UserCheck, Stethoscope } from 'lucide-react'
import type { Tables } from '@/types/supabase.types'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { getStaffFullName } from '@/lib/staff-utils'
import { cn } from '@/lib/utils'
import { EventCard } from './event-card'
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

export default function Event({ event }: { event: CalendarEvent }) {
  const { view } = useIlamyCalendarContext()
  const appointment = event.data as Appointment

  // Extraer datos del appointment
  const pet = appointment?.pets
  const client = pet?.customers
  const staff = appointment?.staff
  const appointmentType = appointment?.appointment_types
  const status = appointment?.status as keyof typeof STATUS_LABELS

  const petName = pet?.name || 'Sin mascota'
  const clientName = client
    ? `${client.first_name} ${client.last_name}`
    : 'Sin cliente'
  const staffName = staff ? getStaffFullName(staff) : null
  const typeName = appointmentType?.name || 'Sin tipo'
  const typeColor = appointmentType?.color || '#3b82f6'

  // Formatear horas
  const startTime = format(event.start.toDate(), 'HH:mm', { locale: es })
  const endTime = format(event.end.toDate(), 'HH:mm', { locale: es })
  const timeRange = `${startTime} - ${endTime}`

  // Función para renderizar el contenido del evento según la vista
  const renderEventContent = () => {
    // Vista Año - Solo indicador de color
    if (view === 'year') {
      return (
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: typeColor }}
          title={`${petName} (${clientName}) - ${typeName}`}
        />
      )
    }

    // Vista Mes - Diseño compacto
    if (view === 'month') {
      return (
        <div
          className={cn(
            'text-xs p-1 rounded-sm border-l-2 bg-white/90 backdrop-blur-sm',
            'hover:bg-white/95 transition-colors cursor-pointer',
            'min-h-[20px] flex flex-col justify-center'
          )}
          style={{ borderLeftColor: typeColor }}
          title={`${petName} (${clientName}) - ${typeName} (${timeRange})`}
        >
          <div className="font-medium text-gray-900 truncate">{petName}</div>
          <div className="text-gray-600 truncate">{startTime}</div>
        </div>
      )
    }

    // Vista Semana - Diseño mediano
    if (view === 'week') {
      return (
        <div
          className={cn(
            'p-1.5 rounded-md  bg-white shadow-sm',
            'hover:shadow-md transition-shadow cursor-pointer',
            'min-h-[32px] h-full flex flex-col justify-between',
            'relative overflow-hidden'
          )}
          style={{ borderLeftColor: typeColor }}
        >
          {/* Contenido principal - siempre visible */}
          <div className="flex items-start justify-between gap-1 min-h-0">
            <div className="font-medium text-xs text-gray-900 truncate leading-tight">
              {petName}
            </div>
            <Badge
              variant={STATUS_VARIANTS[status] as any}
              className="text-[10px] px-1 py-0 h-4 flex-shrink-0"
            >
              {STATUS_LABELS[status]}
            </Badge>
          </div>

          {/* Información adicional - se oculta en eventos muy pequeños */}
          <div className="flex-1 min-h-0 space-y-0.5">
            <div className="text-[10px] text-gray-600 truncate leading-tight">
              {typeName}
            </div>

            <div className="flex items-center gap-1 text-[10px] text-gray-500 leading-tight">
              <Clock className="w-2.5 h-2.5 flex-shrink-0" />
              <span className="truncate">{timeRange}</span>
            </div>
          </div>

          {/* Indicador visual para eventos muy cortos */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundColor: typeColor }}
          />
        </div>
      )
    }

    // Vista Día - Diseño tipo lista horizontal con fondo de color suave
    if (view === 'day') {
      return (
        <div
          className={cn(
            'px-4 py-1 rounded-lg border-1 shadow-sm',
            'hover:shadow-md transition-all duration-200 cursor-pointer',
            'min-h-[120px] bg-opacity-10',
            'flex flex-col justify-between'
          )}
          style={{
            borderColor: typeColor,
            backgroundColor: `${typeColor}30`, // Fondo con opacidad muy baja
          }}
        >
          {/* Título del evento (tipo de cita) */}
          <div className="flex items-start justify-between">
            <h3 className="text-sm font-semibold text-gray-900 leading-tight">
              {typeName}
            </h3>
            <Badge variant={STATUS_VARIANTS[status] as any} className="text-xs">
              {STATUS_LABELS[status]}
            </Badge>
          </div>

          {/* Información de la mascota y cliente */}
          <div className="flex items-center gap-2">
            <User className="w-3 h-3 text-gray-600" />
            <span className="font-medium text-sm text-gray-800">{petName}</span>
            <span className="text-xs text-gray-500">({clientName})</span>
          </div>

          {/* Horario */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {timeRange}
            </span>
          </div>

          {/* Personal médico si existe */}
          {staffName && (
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">{staffName}</span>
            </div>
          )}

          {/* Motivo de la cita si existe */}
          {appointment?.reason && (
            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                Motivo: {appointment.reason}
              </p>
            </div>
          )}

          {/* Notas/descripción si existen */}
          {appointment?.notes && (
            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-600 leading-relaxed">
                {appointment.notes}
              </p>
            </div>
          )}
        </div>
      )
    }

    // Fallback - Vista por defecto (similar a semana)
    return (
      <div
        className={cn(
          'p-2 rounded-md border-l-3 bg-white shadow-sm',
          'hover:shadow-md transition-shadow cursor-pointer',
          'min-h-[60px] space-y-1'
        )}
        style={{ borderLeftColor: typeColor }}
      >
        <div className="font-medium text-sm text-gray-900 truncate">
          {petName}
        </div>
        <div className="text-xs text-gray-600 truncate">{typeName}</div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          {timeRange}
        </div>
      </div>
    )
  }

  return <EventCard appointment={appointment}>{renderEventContent()}</EventCard>
}
