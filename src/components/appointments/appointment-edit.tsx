'use client'

import { useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { AppointmentForm } from './appointment-form'
import { useAppointmentUpdate } from '@/hooks/appointments/use-appointment-update'
import {
  UpdateAppointmentSchema,
  updateAppointmentSchema,
} from '@/schemas/appointments.schema'
import type { Tables } from '@/types/supabase.types'
import { X, Check } from 'lucide-react'
import CanAccess from '@/components/ui/can-access'
import { Field, FieldGroup } from '../ui/field'

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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!w-full !max-w-2xl overflow-y-auto">
        <CanAccess resource="products" action="update">
          <SheetHeader>
            <SheetTitle>Editar Cita</SheetTitle>
            <SheetDescription>
              Modifica los datos de la cita médica
            </SheetDescription>
          </SheetHeader>
          <div className="px-4 pb-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <AppointmentForm />
              </form>
            </Form>
          </div>
          <SheetFooter>
            <FieldGroup>
              <Field orientation="horizontal">
                <ResponsiveButton
                  type="submit"
                  onClick={form.handleSubmit(onSubmit)}
                  isLoading={updateAppointment.isPending}
                  icon={Check}
                >
                  Actualizar Cita
                </ResponsiveButton>
                <ResponsiveButton
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={updateAppointment.isPending}
                  icon={X}
                >
                  Cancelar
                </ResponsiveButton>
              </Field>
            </FieldGroup>
          </SheetFooter>
        </CanAccess>
      </SheetContent>
    </Sheet>
  )
}
