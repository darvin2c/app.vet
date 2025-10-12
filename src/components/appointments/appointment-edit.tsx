'use client'

import { useEffect } from 'react'
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
} from '@/components/ui/drawer-form'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { AppointmentForm } from './appointment-form'
import { useUpdateAppointment } from '@/hooks/appointments/use-update-appointment'
import {
  UpdateAppointmentSchema,
  updateAppointmentSchema,
} from '@/schemas/appointments.schema'
import type { Tables } from '@/types/supabase.types'
import { toast } from 'sonner'
import { X, Check } from 'lucide-react'

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

  const updateAppointment = useUpdateAppointment()

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
        notes: appointment.notes || '',
      })
    }
  }, [appointment, open, form])

  const onSubmit: SubmitHandler<UpdateAppointmentSchema> = async (data) => {
    await updateAppointment.mutateAsync({
      id: data.id,
      pet_id: data.pet_id,
      veterinarian_id: data.veterinarian_id,
      appointment_type_id: data.appointment_type_id,
      scheduled_start: data.scheduled_start,
      scheduled_end: data.scheduled_end,
      status: data.status,
      reason: data.reason,
      notes: data.notes,
    })
    onOpenChange(false)
    onSuccess?.()
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!w-full !max-w-2xl">
        <DrawerHeader>
          <DrawerTitle>Editar Cita</DrawerTitle>
          <DrawerDescription>
            Modifica los datos de la cita médica
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <AppointmentForm />
            </form>
          </Form>
        </div>
        <DrawerFooter>
          <ResponsiveButton
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updateAppointment.isPending}
            icon={X}
          >
            Cancelar
          </ResponsiveButton>
          <ResponsiveButton
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            isLoading={updateAppointment.isPending}
            icon={Check}
          >
            Actualizar Cita
          </ResponsiveButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
