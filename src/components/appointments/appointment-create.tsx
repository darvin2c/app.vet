'use client'

import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormSheet } from '@/components/ui/form-sheet'
import { AppointmentForm } from './appointment-form'
import { useAppointmentCreate } from '@/hooks/appointments/use-appointment-create'
import {
  CreateAppointmentSchema,
  createAppointmentSchema,
} from '@/schemas/appointments.schema'
import CanAccess from '@/components/ui/can-access'

interface AppointmentCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  defaultScheduledStart?: string
  defaultScheduledEnd?: string
  defaultPetId?: string
}

export function AppointmentCreate({
  open,
  onOpenChange,
  onSuccess,
  defaultScheduledStart,
  defaultScheduledEnd,
  defaultPetId,
}: AppointmentCreateProps) {
  const createAppointment = useAppointmentCreate()

  const form = useForm<CreateAppointmentSchema>({
    resolver: zodResolver(createAppointmentSchema) as any,
    defaultValues: {
      pet_id: defaultPetId || '',
      appointment_type_id: '',
      scheduled_start: defaultScheduledStart || '',
      scheduled_end: defaultScheduledEnd || '',
      veterinarian_id: undefined,
      status: 'scheduled' as any,
      reason: '',
      notes: '',
    },
  })

  // Update form values when default props change
  React.useEffect(() => {
    const newDefaults = {
      pet_id: defaultPetId || '',
      appointment_type_id: '',
      scheduled_start: defaultScheduledStart || '',
      scheduled_end: defaultScheduledEnd || '',
      veterinarian_id: undefined,
      status: 'scheduled' as any,
      reason: '',
      notes: '',
    }

    form.reset(newDefaults)
  }, [defaultScheduledStart, defaultScheduledEnd, defaultPetId, form])

  const onSubmit: SubmitHandler<CreateAppointmentSchema> = async (data) => {
    await createAppointment.mutateAsync({
      pet_id: data.pet_id,
      veterinarian_id: data.veterinarian_id,
      appointment_type_id: data.appointment_type_id,
      scheduled_start: data.scheduled_start,
      scheduled_end: data.scheduled_end,
      status: data.status,
      reason: data.reason,
      notes: data.notes,
    })

    // Handle success
    form.reset()
    onOpenChange(false)
    onSuccess?.()
  }

  return (
    <CanAccess resource="appointments" action="create">
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Nueva Cita"
        description="Programa una nueva cita médica"
        form={form as any}
        onSubmit={onSubmit as any}
        isPending={createAppointment.isPending}
        submitLabel="Crear Cita"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-2xl"
      >
        <AppointmentForm disablePetSelection={!!defaultPetId} />
      </FormSheet>
    </CanAccess>
  )
}
