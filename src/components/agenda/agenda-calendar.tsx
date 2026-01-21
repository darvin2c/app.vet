'use client'

import {
  useState,
  useMemo,
  useEffect,
  useCallback,
  startTransition,
} from 'react'
import { useAppointmentList as useAppointments } from '@/hooks/appointments/use-appointment-list'
import { useAppointmentUpdate } from '@/hooks/appointments/use-appointment-update'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'
import { IlamyCalendar, CalendarEvent } from '@ilamy/calendar'
import { Tables } from '@/types/supabase.types'
import AgendaHeader from './agenda-header'
import dayjs from '@/lib/dayjs'
import Event from './event'
import { AgendaEventForm } from './agenda-event-form'
import { cx } from 'class-variance-authority'
import { Dayjs } from 'dayjs'

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

type View = 'month' | 'week' | 'day' | 'year'

const parseTimeToDecimal = (timeStr?: string) => {
  if (!timeStr) return 0

  const normalized = timeStr.trim().toUpperCase()
  // Matches "HH:MM", "H:MM", "HH:MM AM", "HH:MM PM", etc.
  const match = normalized.match(/^(\d{1,2}):(\d{1,2})(?:\s*(AM|PM))?$/)

  if (!match) {
    // Fallback to simple split if regex fails (legacy behavior compatibility)
    const [h, m] = normalized.split(':').map((v) => parseInt(v, 10))
    if (!isNaN(h)) {
      return h + (isNaN(m) ? 0 : m) / 60
    }
    return 0
  }

  let hours = parseInt(match[1], 10)
  const minutes = parseInt(match[2], 10)
  const meridiem = match[3]

  if (meridiem) {
    if (meridiem === 'PM' && hours < 12) {
      hours += 12
    } else if (meridiem === 'AM' && hours === 12) {
      hours = 0
    }
  }

  return hours + minutes / 60
}

export function AgendaCalendar({ className }: AgendaCalendarProps) {
  const [currentDate, setCurrentDate] = useState(dayjs())
  const { currentTenant } = useCurrentTenantStore()
  const [view, setView] = useState<View>(
    (localStorage.getItem('agenda-view') as View) || 'month'
  )

  // Obtener citas del mes actual
  const startOfMonth = currentDate.startOf('month').add(-15, 'day')
  const endOfMonth = currentDate.endOf('month').add(15, 'day')

  const { data: appointments = [], isLoading } = useAppointments({
    filters: [
      {
        field: 'scheduled_start',
        operator: 'gte',
        value: startOfMonth.toISOString(),
      },
      {
        field: 'scheduled_end',
        operator: 'lte',
        value: endOfMonth.toISOString(),
      },
    ],
  })
  const appointmentUpdate = useAppointmentUpdate()

  // Convertir appointments a eventos para @ilamy/calendar
  const events = useMemo(() => {
    return appointments
      .map(
        (appointment: Appointment): CalendarEvent => ({
          id: appointment.id,
          title: `${appointment.pets?.name || 'Sin mascota'}`,
          start: dayjs(appointment.scheduled_start),
          end: dayjs(appointment.scheduled_end),
          color: appointment.appointment_types?.color || '#3b82f6',
          data: appointment,
        })
      )
      .sort((a, b) => a.start.valueOf() - b.start.valueOf())
  }, [appointments])

  const handleViewChange = (newView: 'month' | 'week' | 'day' | 'year') => {
    setView(newView)
  }

  const handleDateChange = useCallback((date: Dayjs) => {
    // Defer update to avoid "Cannot update ... while rendering" error
    setTimeout(() => {
      startTransition(() => {
        setCurrentDate(dayjs(date))
      })
    }, 0)
  }, [])

  const businessHours = useMemo(() => {
    const bh = currentTenant?.business_hours

    if (!bh?.enabled) return undefined

    const daysMap = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ] as const

    const hours = []

    for (let i = 0; i < 7; i++) {
      const dayName = daysMap[i]
      const dayConfig = bh[dayName]

      if (dayConfig?.enabled) {
        hours.push({
          daysOfWeek: [dayName],
          startTime: parseTimeToDecimal(dayConfig.start),
          endTime: parseTimeToDecimal(dayConfig.end),
        })
      }
    }

    return hours
  }, [currentTenant])

  /**
   * ⚠️ WARNING: Bloqueo de clics en los encabezados de la vista semanal
   *
   * En la vista semanal, los encabezados de los días (Lun, Mar, Mié, etc.)
   * están bloqueando los clics. Esto significa que cuando el usuario hace clic
   * en el encabezado de un día, el evento onCellClick no se dispara.
   *
   * Esto es un problema conocido de la librería @ilamy/calendar y puede
   * requerir una solución personalizada o actualización de la librería.
   * Esto no debe de ELIMINARSE
   */

  const handleWeekHeaderClick = (e: MouseEvent) => {
    e.stopPropagation()
  }

  useEffect(() => {
    const selector = '[data-testid="week-header"]'

    setTimeout(() => {
      const weekHeader = document.querySelector<HTMLElement>(selector)
      weekHeader?.addEventListener('click', handleWeekHeaderClick)
    }, 500)

    return () => {
      const weekHeader = document.querySelector<HTMLElement>(selector)
      weekHeader?.removeEventListener('click', handleWeekHeaderClick)
    }
  }, [view])

  useEffect(() => {
    // save view to localStorage
    localStorage.setItem('agenda-view', view)
  }, [view])

  return (
    <div className={cx('min-h-0 min-w-0', className)}>
      <IlamyCalendar
        stickyViewHeader={true}
        events={events}
        initialView={view}
        onViewChange={handleViewChange}
        onEventUpdate={(event) => {
          appointmentUpdate.mutate({
            id: event.id as string,
            data: {
              scheduled_start: event.start.toISOString(),
              scheduled_end: event.end.toISOString(),
            },
          })
        }}
        renderEvent={(event) => <Event event={event} />}
        locale="es"
        firstDayOfWeek="monday"
        timezone={currentTenant?.timezone || undefined}
        timeFormat="12-hour"
        headerComponent={
          <AgendaHeader initialDate={currentDate} initialView={view} />
        }
        onDateChange={handleDateChange}
        disableDragAndDrop={true}
        businessHours={businessHours}
        renderEventForm={(props) => <AgendaEventForm {...props} />}
        renderCurrentTimeIndicator={({ progress, currentTime }) => (
          <div
            style={{ top: `${progress}%` }}
            className="absolute left-0 right-0 z-20 pointer-events-none"
          >
            <div className="h-[0.5px] w-full bg-red-500" />
            <div className="absolute left-0 -translate-y-1/2 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-r-sm shadow-sm">
              {currentTime.format('HH:mm')}
            </div>
          </div>
        )}
      />
    </div>
  )
}
