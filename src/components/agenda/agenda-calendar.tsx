'use client'

import {
  useState,
  useMemo,
  useEffect,
  useCallback,
  startTransition,
} from 'react'
import { IlamyCalendar, CalendarEvent } from '@ilamy/calendar'
import { useAppointmentList as useAppointments } from '@/hooks/appointments/use-appointment-list'
import { Tables } from '@/types/supabase.types'
import dayjs from '@/lib/dayjs'
import { AppointmentCreate } from '../appointments/appointment-create'
import Event from './event'
import AgendaHeader from './agenda-header'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'
import { useAppointmentUpdate } from '@/hooks/appointments/use-appointment-update'

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
  const { currentTenant } = useCurrentTenantStore()
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

  const handleDateChange = useCallback((date: dayjs.Dayjs) => {
    startTransition(() => {
      setCurrentDate(date)
    })
  }, [])

  const handleCreateSuccess = () => {
    console.log('Create success - closing modal and clearing state')
    setCreateModalOpen(false)
    setSelectedDateTime(null)
  }

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
  console.log(currentTenant)
  return (
    <div className={className}>
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
        onCellClick={handleCellClick}
        timezone={currentTenant?.timezone || undefined}
        headerComponent={
          <AgendaHeader initialDate={currentDate} initialView={view} />
        }
        onEventClick={(event) => console.log('Event clicked:', event)}
        onDateChange={handleDateChange}
      />

      {businessHoursCss && <style>{businessHoursCss}</style>}

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
