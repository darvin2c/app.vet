'use client'

import { useIlamyCalendarContext, type CalendarEvent } from '@ilamy/calendar'
import { Clock, User, UserCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { EventCard } from './event-card'
import { AppointmentWithRelations } from '@/types/appointment.types'
import useAppointmentStatus from '@/hooks/appointments/use-appointment-status'
import { Enums } from '@/types/supabase.types'
import dayjs from '@/lib/dayjs'

// Tipo para el appointment con relaciones
type Appointment = AppointmentWithRelations

type StatusValue = Enums<'appointment_status'>

export default function Event({ event }: { event: CalendarEvent }) {
  const { view } = useIlamyCalendarContext()
  const appointment = event.data as Appointment

  // Extraer datos del appointment
  const pet = appointment?.pets
  const client = pet?.customers
  const staff = appointment?.staff
  const appointmentType = appointment?.appointment_types
  const status: StatusValue = (appointment?.status ||
    'scheduled') as StatusValue

  const petName = pet?.name || '-'
  const clientName = client
    ? `${client.first_name} ${client.last_name}`
    : 'Sin cliente'
  const staffName = staff ? `${staff.first_name} ${staff.last_name}` : null
  const typeName = appointmentType?.name || '-'
  const typeColor = appointmentType?.color || '#3b82f6'

  const { statusList, getStatus } = useAppointmentStatus()
  const statusColor =
    statusList.find((s) => s.value === status)?.color || '#64748b'
  const statusLabel = getStatus(status)
  const isPast = event.end.isBefore(dayjs())

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
            'text-[11px] px-2 py-1 rounded-md',
            'transition-colors cursor-pointer',
            'min-h-[20px] flex items-center gap-2',
            'shadow-sm border-l-4'
          )}
          style={{
            backgroundColor: `${typeColor}${isPast ? '15' : '22'}`,
            color: '#1f2937',
            borderLeftColor: statusColor,
            ...(isPast
              ? {
                  backgroundImage: `linear-gradient(${typeColor}15, ${typeColor}15), repeating-linear-gradient(135deg, ${statusColor}33 0px, ${statusColor}33 2px, transparent 2px, transparent 6px)`,
                  backgroundSize: 'auto, 6px 6px',
                }
              : {}),
          }}
          title={`${petName} (${clientName}) - ${typeName} (${timeRange})`}
        >
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ backgroundColor: statusColor }}
          />
          <span className="font-medium truncate max-w-[120px]">{petName}</span>
          <span className="text-[10px] text-gray-700">{startTime}</span>
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
          style={{
            borderLeftColor: statusColor,
            borderLeftWidth: 4,
            borderLeftStyle: 'solid',
          }}
        >
          {/* Contenido principal - siempre visible */}
          <div className="flex items-start justify-between gap-1 min-h-0">
            <div className="font-medium text-xs text-gray-900 truncate leading-tight">
              {petName}
            </div>
            <Badge
              className="text-[10px] px-1 py-0 h-4 flex-shrink-0"
              style={{ backgroundColor: statusColor, color: '#fff' }}
            >
              {statusLabel}
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

          {isPast ? (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `repeating-linear-gradient(135deg, ${statusColor}33 0px, ${statusColor}33 2px, transparent 2px, transparent 6px)`,
                opacity: 0.6,
              }}
            />
          ) : (
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{ backgroundColor: typeColor }}
            />
          )}
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
            'flex flex-col justify-between',
            'relative overflow-hidden'
          )}
          style={{
            borderColor: statusColor,
            backgroundColor: `${typeColor}30`,
          }}
        >
          {/* Título del evento (tipo de cita) */}
          <div className="flex items-start justify-between">
            <h3 className="text-sm font-semibold text-gray-900 leading-tight">
              {typeName}
            </h3>
            <Badge
              className="text-xs"
              style={{ backgroundColor: statusColor, color: '#fff' }}
            >
              {statusLabel}
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
          {isPast && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `repeating-linear-gradient(135deg, ${statusColor}33 0px, ${statusColor}33 2px, transparent 2px, transparent 6px)`,
                opacity: 0.6,
              }}
            />
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
          'min-h-[60px] space-y-1',
          'relative overflow-hidden'
        )}
        style={{
          borderLeftColor: statusColor,
          borderLeftWidth: 3,
          borderLeftStyle: 'solid',
        }}
      >
        <div className="font-medium text-sm text-gray-900 truncate">
          {petName}
        </div>
        <div className="text-xs text-gray-600 truncate">{typeName}</div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          {timeRange}
        </div>
        {isPast && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(135deg, ${statusColor}33 0px, ${statusColor}33 2px, transparent 2px, transparent 6px)`,
              opacity: 0.6,
            }}
          />
        )}
      </div>
    )
  }

  return <EventCard appointment={appointment}>{renderEventContent()}</EventCard>
}
