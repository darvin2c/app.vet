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
import { useCreateAppointment } from '@/hooks/appointments/use-create-appointment'
import {
  CreateAppointmentSchema,
  createAppointmentSchema,
} from '@/schemas/appointments.schema'
import { X, Check } from 'lucide-react'

interface AppointmentCreateProps {
  trigger?: React.ReactNode
  onSuccess?: () => void
  defaultStartTime?: string
  defaultEndTime?: string
  defaultPatientId?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function AppointmentCreate({
  trigger,
  onSuccess,
  defaultStartTime,
  defaultEndTime,
  defaultPatientId,
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
      patient_id: defaultPatientId || '',
      appointment_type_id: '',
      start_time: defaultStartTime || '',
      end_time: defaultEndTime || '',
      staff_id: undefined,
      procedure_id: undefined,
      notes: '',
    },
  })

  // Update form values when default props change
  React.useEffect(() => {
    // Reset the entire form with new default values
    const newDefaults = {
      patient_id: defaultPatientId || '',
      appointment_type_id: '',
      start_time: defaultStartTime || '',
      end_time: defaultEndTime || '',
      staff_id: undefined,
      procedure_id: undefined,
      notes: '',
    }

    form.reset(newDefaults)
  }, [defaultStartTime, defaultEndTime, defaultPatientId, form])

  const createAppointment = useCreateAppointment()

  const onSubmit: SubmitHandler<CreateAppointmentSchema> = async (data) => {
    console.log(data)
    await createAppointment.mutateAsync({
      patient_id: data.patient_id,
      staff_id: data.staff_id,
      procedure_id: data.procedure_id,
      appointment_type_id: data.appointment_type_id,
      start_time: data.start_time,
      end_time: data.end_time,
      status: data.status,
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
              <AppointmentForm disablePatientSelection={!!defaultPatientId} />
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
