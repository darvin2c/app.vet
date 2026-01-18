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

  const businessHoursCss = useMemo(() => {
    const bh = (currentTenant as any)?.business_hours
    if (!bh?.enabled) return ''
    const toMinutes = (t?: string) => {
      if (!t) return 0
      const [h, m] = t.split(':').map(Number)
      return h * 60 + (m || 0)
    }
    const dayKey = (d: dayjs.Dayjs) => {
      const i = d.day()
      return [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ][i]
    }
    const startOf = currentDate.startOf('week')
    const rules: string[] = []
    if (view === 'week') {
      for (let i = 0; i < 7; i++) {
        const d = startOf.add(i, 'day')
        const key = dayKey(d)
        const cfg = bh?.[key]
        const enabled = !!cfg?.enabled
        const sMin = toMinutes(cfg?.start)
        const eMin = toMinutes(cfg?.end)
        for (let h = 0; h < 24; h++) {
          const cellMinStart = h * 60
          const cellMinEnd = (h + 1) * 60
          const mark =
            !enabled ||
            eMin <= sMin ||
            cellMinEnd <= sMin ||
            cellMinStart >= eMin
          if (mark) {
            const ds = d.format('YYYY-MM-DD')
            const hh = String(h).padStart(2, '0')
            rules.push(
              `[data-testid="week-time-cell-${ds}-${hh}"]{background-image:repeating-linear-gradient(135deg, rgba(107,114,128,0.25) 0px, rgba(107,114,128,0.25) 2px, transparent 2px, transparent 6px);opacity:.5;}`
            )
          }
        }
      }
    } else if (view === 'day') {
      const key = dayKey(currentDate)
      const cfg = bh?.[key]
      const enabled = !!cfg?.enabled
      const sMin = toMinutes(cfg?.start)
      const eMin = toMinutes(cfg?.end)
      for (let h = 0; h < 24; h++) {
        for (const mm of [0, 15, 30, 45]) {
          const cellMinStart = h * 60 + mm
          const cellMinEnd = cellMinStart + 15
          const mark =
            !enabled ||
            eMin <= sMin ||
            cellMinEnd <= sMin ||
            cellMinStart >= eMin
          if (mark) {
            const hh = String(h).padStart(2, '0')
            const mms = String(mm).padStart(2, '0')
            rules.push(
              `[data-testid="day-time-cell-${hh}-${mms}"]{background-image:repeating-linear-gradient(135deg, rgba(107,114,128,0.25) 0px, rgba(107,114,128,0.25) 2px, transparent 2px, transparent 6px);opacity:.5;}`
            )
          }
        }
      }
    }
    return rules.join('\n')
  }, [view, currentDate, currentTenant])

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

      {businessHoursCss && <style>{businessHoursCss}</style>}
    </div>
  )
}
