'use client'

import { useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormSheet } from '@/components/ui/form-sheet'
import { AppointmentForm } from './appointment-form'
import { useAppointmentUpdate } from '@/hooks/appointments/use-appointment-update'
import {
  UpdateAppointmentSchema,
  updateAppointmentSchema,
} from '@/schemas/appointments.schema'
import type { Tables } from '@/types/supabase.types'
import CanAccess from '@/components/ui/can-access'

type Appointment = Tables<'appointments'>

interface AppointmentEditProps {
  appointment: Appointment
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AppointmentEdit({
  appointment,
  open,
  onOpenChange,
  onSuccess,
}: AppointmentEditProps) {
  const form = useForm<UpdateAppointmentSchema>({
    resolver: zodResolver(updateAppointmentSchema),
  })

  const updateAppointment = useAppointmentUpdate()

  // Set form values when appointment changes
  useEffect(() => {
    if (appointment && open) {
      form.reset({
        id: appointment.id,
        pet_id: appointment.pet_id,
        veterinarian_id: appointment.veterinarian_id || undefined,
        appointment_type_id: appointment.appointment_type_id || undefined,
        scheduled_start: appointment.scheduled_start,
        scheduled_end: appointment.scheduled_end,
        status: appointment.status as UpdateAppointmentSchema['status'],
        reason: appointment.reason || '',
      })
    }
  }, [appointment, open, form])

  const onSubmit: SubmitHandler<UpdateAppointmentSchema> = async (data) => {
    await updateAppointment.mutateAsync({
      id: data.id,
      data: {
        pet_id: data.pet_id,
        veterinarian_id: data.veterinarian_id,
        appointment_type_id: data.appointment_type_id,
        scheduled_start: data.scheduled_start,
        scheduled_end: data.scheduled_end,
        status: data.status,
        reason: data.reason,
      },
    })
    onOpenChange(false)
    onSuccess?.()
  }

  return (
    <CanAccess resource="products" action="update">
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Editar Cita"
        description="Modifica los datos de la cita médica"
        form={form}
        onSubmit={onSubmit}
        isPending={updateAppointment.isPending}
        submitLabel="Actualizar Cita"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-2xl"
      >
        <AppointmentForm />
      </FormSheet>
    </CanAccess>
  )
}
