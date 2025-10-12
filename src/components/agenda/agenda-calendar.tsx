'use client'

import { useState, useMemo, useEffect } from 'react'
import { IlamyCalendar, CalendarEvent } from '@ilamy/calendar'
import useAppointments from '@/hooks/appointments/use-appointments'
import { Tables } from '@/types/supabase.types'
import dayjs from 'dayjs'
import { AppointmentCreate } from '../appointments/appointment-create'
import Event from './event'
import AgendaHeader from './agenda-header'

type Appointment = Tables<'appointments'> & {
  pets: (Tables<'pets'> & {
    clients: Tables<'clients'> | null
  }) | null
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
        translations={{
          today: 'Hoy',
          create: 'Crear',
          new: 'Nuevo',
          update: 'Actualizar',
          delete: 'Eliminar',
          cancel: 'Cancelar',
          export: 'Exportar',
          event: 'Evento',
          events: 'Eventos',
          newEvent: 'Nuevo Evento',
          title: 'Título',
          description: 'Descripción',
          location: 'Ubicación',
          allDay: 'Todo el día',
          startDate: 'Fecha de inicio',
          endDate: 'Fecha de fin',
          startTime: 'Hora de inicio',
          endTime: 'Hora de fin',
          color: 'Color',
          createEvent: 'Crear Evento',
          editEvent: 'Editar Evento',
          addNewEvent: 'Agregar Nuevo Evento',
          editEventDetails: 'Editar Detalles del Evento',
          eventTitlePlaceholder: 'Título del evento',
          eventDescriptionPlaceholder: 'Descripción del evento',
          eventLocationPlaceholder: 'Ubicación del evento',
          repeat: 'Repetir',
          repeats: 'Se repite',
          customRecurrence: 'Recurrencia personalizada',
          daily: 'Diario',
          weekly: 'Semanal',
          monthly: 'Mensual',
          yearly: 'Anual',
          interval: 'Intervalo',
          repeatOn: 'Repetir en',
          never: 'Nunca',
          count: 'Cantidad',
          every: 'Cada',
          ends: 'Termina',
          after: 'Después de',
          occurrences: 'ocurrencias',
          on: 'el',
          editRecurringEvent: 'Editar Evento Recurrente',
          deleteRecurringEvent: 'Eliminar Evento Recurrente',
          editRecurringEventQuestion: '¿Qué deseas editar?',
          deleteRecurringEventQuestion: '¿Qué deseas eliminar?',
          thisEvent: 'Este evento',
          thisEventDescription: 'Solo este evento',
          thisAndFollowingEvents: 'Este y siguientes eventos',
          thisAndFollowingEventsDescription:
            'Este evento y todos los siguientes',
          allEvents: 'Todos los eventos',
          allEventsDescription: 'Toda la serie de eventos',
          onlyChangeThis: 'Solo cambiar este',
          changeThisAndFuture: 'Cambiar este y futuros',
          changeEntireSeries: 'Cambiar toda la serie',
          onlyDeleteThis: 'Solo eliminar este',
          deleteThisAndFuture: 'Eliminar este y futuros',
          deleteEntireSeries: 'Eliminar toda la serie',
          month: 'Mes',
          week: 'Semana',
          day: 'Día',
          year: 'Año',
          more: 'más',
          sunday: 'Domingo',
          monday: 'Lunes',
          tuesday: 'Martes',
          wednesday: 'Miércoles',
          thursday: 'Jueves',
          friday: 'Viernes',
          saturday: 'Sábado',
          sun: 'Dom',
          mon: 'Lun',
          tue: 'Mar',
          wed: 'Mié',
          thu: 'Jue',
          fri: 'Vie',
          sat: 'Sáb',
          january: 'Enero',
          february: 'Febrero',
          march: 'Marzo',
          april: 'Abril',
          may: 'Mayo',
          june: 'Junio',
          july: 'Julio',
          august: 'Agosto',
          september: 'Septiembre',
          october: 'Octubre',
          november: 'Noviembre',
          december: 'Diciembre',
        }}
      />

      {/* Modal de crear cita */}
      <AppointmentCreate
        open={createModalOpen}
        onSuccess={handleCreateSuccess}
        defaultScheduledStart={selectedDateTime?.startTime}
        defaultScheduledEnd={selectedDateTime?.endTime}
      />
    </div>
  )
}
