'use client'

import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer-form'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { AppointmentForm } from './appointment-form'
import { useAppointmentCreate } from '@/hooks/appointments/use-appointment-create'
import {
  CreateAppointmentSchema,
  createAppointmentSchema,
} from '@/schemas/appointments.schema'
import { X, Check } from 'lucide-react'

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
    try {
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
    } catch (error) {
      // Error is already handled by the hook
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!w-full !max-w-3xl">
        <DrawerHeader>
          <DrawerTitle>Nueva Cita</DrawerTitle>
          <DrawerDescription>Programa una nueva cita médica</DrawerDescription>
        </DrawerHeader>

        <div className="px-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit as any)}
              className="space-y-6"
            >
              <AppointmentForm disablePetSelection={!!defaultPetId} />
            </form>
          </Form>
        </div>

        <DrawerFooter>
          <ResponsiveButton
            type="submit"
            onClick={form.handleSubmit(onSubmit as any)}
            isLoading={createAppointment.isPending}
            icon={Check}
          >
            {createAppointment.isPending ? 'Creando...' : 'Crear Cita'}
          </ResponsiveButton>
          <DrawerClose asChild>
            <ResponsiveButton
              variant="outline"
              disabled={createAppointment.isPending}
              icon={X}
            >
              Cancelar
            </ResponsiveButton>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
