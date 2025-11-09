'use client'

import { useState, useMemo, useEffect } from 'react'
import { IlamyCalendar, CalendarEvent } from '@ilamy/calendar'
import { useAppointmentList as useAppointments } from '@/hooks/appointments/use-appointment-list'
import { Tables } from '@/types/supabase.types'
import dayjs from '@/lib/dayjs'
import { AppointmentCreate } from '../appointments/appointment-create'
import Event from './event'
import AgendaHeader from './agenda-header'

type Appointment = Tables<'appointments'> & {
  pets:
    | (Tables<'pets'> & {
        customers: Tables<'customers'> | null
      })
    | null
  staff: Tables<'staff'> | null
  appointment_types: Tables<'appointment_types'> | null
}

interface AgendaCalendarProps {
  className?: string
}

export function AgendaCalendar({ className }: AgendaCalendarProps) {
  const [currentDate, setCurrentDate] = useState(dayjs())
  const [view, setView] = useState<'month' | 'week' | 'day' | 'year'>('month')

  // Estados para el modal de crear cita
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [selectedDateTime, setSelectedDateTime] = useState<{
    startTime: string
    endTime: string
  } | null>(null)

  // Obtener citas del mes actual
  const startOfMonth = currentDate.startOf('month')
  const endOfMonth = currentDate.endOf('month')

  const { data: appointments = [], isLoading } = useAppointments({
    start_date: startOfMonth.toISOString(),
    end_date: endOfMonth.toISOString(),
  })

  // Convertir appointments a eventos para @ilamy/calendar
  const events = useMemo(() => {
    return appointments.map(
      (appointment: Appointment): CalendarEvent => ({
        id: appointment.id,
        title: `${appointment.pets?.name || 'Sin mascota'}`,
        start: dayjs(appointment.scheduled_start),
        end: dayjs(appointment.scheduled_end),
        color: appointment.appointment_types?.color || '#3b82f6',
        data: appointment, // Datos completos para usar en eventos
      })
    )
  }, [appointments])

  const handleViewChange = (newView: 'month' | 'week' | 'day' | 'year') => {
    setView(newView)
  }

  const handleCellClick = (start: dayjs.Dayjs, end: dayjs.Dayjs) => {
    console.log(
      'Cell clicked:',
      start.format('YYYY-MM-DD'),
      end.format('YYYY-MM-DD')
    )
    setSelectedDateTime({
      startTime: start.format('YYYY-MM-DDTHH:mm'),
      endTime: end.format('YYYY-MM-DDTHH:mm'),
    })
    setCreateModalOpen(true)
  }

  const handleCreateSuccess = () => {
    console.log('Create success - closing modal and clearing state')
    setCreateModalOpen(false)
    setSelectedDateTime(null)
  }

  /**
   * ⚠️ WARNING: Bloqueo de clics en los encabezados de la vista semanal
   *
   * En la vista semanal, los encabezados de los días (Lun, Mar, Mié, etc.)
   * están bloqueando los clics. Esto significa que cuando el usuario hace clic
   * en el encabezado de un día, el evento onCellClick no se dispara.
   *
   * Esto es un problema conocido de la librería @ilamy/calendar y puede
   * requerir una solución personalizada o actualización de la librería.
   */

  // Remover el event listener al desmontar el componente
  useEffect(() => {
    return () => {
      // Cleanup si es necesario
    }
  }, [])

  return (
    <div className={className}>
      <IlamyCalendar
        events={events}
        initialView={view}
        onViewChange={handleViewChange}
        renderEvent={(event) => <Event event={event} />}
        locale="es"
        firstDayOfWeek="monday"
        onCellClick={handleCellClick}
        headerComponent={<AgendaHeader />}
        onEventClick={(event) => console.log('Event clicked:', event)}
        onDateChange={(date) => {
          setCurrentDate(date)
        }}
      />

      {/* Modal de crear cita */}
      <AppointmentCreate
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={handleCreateSuccess}
        defaultScheduledStart={selectedDateTime?.startTime}
        defaultScheduledEnd={selectedDateTime?.endTime}
      />
    </div>
  )
}
