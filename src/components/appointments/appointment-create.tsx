'use client'

import { useState } from 'react'
import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
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
  trigger?: React.ReactNode
  onSuccess?: () => void
  defaultScheduledStart?: string
  defaultScheduledEnd?: string
  defaultPetId?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function AppointmentCreate({
  trigger,
  onSuccess,
  defaultScheduledStart,
  defaultScheduledEnd,
  defaultPetId,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: AppointmentCreateProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen

  const handleOpenChange = (newOpen: boolean) => {
    if (controlledOpen !== undefined) {
      // En modo controlado, usamos onOpenChange si está disponible
      controlledOnOpenChange?.(newOpen)
    } else {
      // En modo no controlado, manejamos el estado internamente
      setInternalOpen(newOpen)
    }
  }

  const form = useForm<CreateAppointmentSchema>({
    resolver: zodResolver(createAppointmentSchema) as any,
    defaultValues: {
      pet_id: defaultPetId || '',
      appointment_type_id: '',
      scheduled_start: defaultScheduledStart || '',
      scheduled_end: defaultScheduledEnd || '',
      veterinarian_id: undefined,
      reason: '',
      notes: '',
    },
  })

  // Update form values when default props change
  React.useEffect(() => {
    // Reset the entire form with new default values
    const newDefaults = {
      pet_id: defaultPetId || '',
      appointment_type_id: '',
      scheduled_start: defaultScheduledStart || '',
      scheduled_end: defaultScheduledEnd || '',
      veterinarian_id: undefined,
      reason: '',
      notes: '',
    }

    form.reset(newDefaults)
  }, [defaultScheduledStart, defaultScheduledEnd, defaultPetId, form])

  const createAppointment = useAppointmentCreate()

  const onSubmit: SubmitHandler<CreateAppointmentSchema> = async (data) => {
    console.log(data)
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
    form.reset()
    handleOpenChange(false)
  }

  const handleCancel = () => {
    handleOpenChange(false)
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="!w-full !max-w-3xl">
        <DrawerHeader>
          <DrawerTitle>Nueva Cita</DrawerTitle>
          <DrawerDescription>Programa una nueva cita médica</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4">
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
            variant="outline"
            onClick={handleCancel}
            disabled={createAppointment.isPending}
            icon={X}
          >
            Cancelar
          </ResponsiveButton>
          <ResponsiveButton
            type="submit"
            onClick={form.handleSubmit(onSubmit as any)}
            isLoading={createAppointment.isPending}
            icon={Check}
          >
            Crear Cita
          </ResponsiveButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
