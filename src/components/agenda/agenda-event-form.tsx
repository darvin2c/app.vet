'use client'

import { useState } from 'react'
import { EventFormProps } from '@ilamy/calendar'
import { AppointmentCreate } from '../appointments/appointment-create'
import { AppointmentEdit } from '../appointments/appointment-edit'
import { AppointmentDelete } from '../appointments/appointment-delete'
import { Tables } from '@/types/supabase.types'

type Appointment = Tables<'appointments'> & {
  pets:
    | (Tables<'pets'> & {
        customers: Tables<'customers'> | null
      })
    | null
  staff: Tables<'staff'> | null
  appointment_types: Tables<'appointment_types'> | null
}

export function AgendaEventForm({
  open,
  selectedEvent,
  onClose,
}: EventFormProps) {
  const [deleteOpen, setDeleteOpen] = useState(false)

  // Si no hay evento seleccionado, no mostramos nada
  if (!selectedEvent && !open) return null

  // Determinar si es edición (si tiene ID) o creación
  const isEdit = !!selectedEvent?.id
  const appointment = selectedEvent?.data as Appointment

  // Si es edición y tenemos datos de la cita
  if (isEdit && appointment) {
    return (
      <>
        <AppointmentEdit
          open={open || false}
          onOpenChange={(isOpen) => !isOpen && onClose()}
          appointment={appointment}
          onSuccess={() => {
            onClose()
          }}
          onDelete={() => {
            setDeleteOpen(true)
          }}
        />
        <AppointmentDelete
          open={deleteOpen}
          onOpenChange={(open) => {
            setDeleteOpen(open)
            if (!open) {
              // Si cancelamos borrar, mantenemos edit abierto
            }
          }}
          appointment={appointment}
          onSuccess={() => {
            setDeleteOpen(false)
            onClose() // Cerramos todo al eliminar con éxito
          }}
        />
      </>
    )
  }

  // Si es creación
  // selectedEvent en creación tiene start y end (dayjs)
  return (
    <AppointmentCreate
      open={open || false}
      onOpenChange={(isOpen) => !isOpen && onClose()}
      onSuccess={() => {
        onClose()
      }}
      defaultScheduledStart={
        selectedEvent?.start
          ? (selectedEvent.start as any).toISOString()
          : undefined
      }
      defaultScheduledEnd={
        selectedEvent?.end
          ? (selectedEvent.end as any).toISOString()
          : undefined
      }
    />
  )
}
