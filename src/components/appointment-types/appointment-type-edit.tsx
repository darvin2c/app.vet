'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useAppointmentTypeUpdate } from '@/hooks/appointment-types/use-appointment-type-update'
import { AppointmentTypeForm } from './appointment-type-form'
import { FormSheet } from '@/components/ui/form-sheet'
import type { Tables } from '@/types/supabase.types'
import { Separator } from '../ui/separator'
import { appointmentTypeUpdateSchema } from '@/schemas/appointment-types.schema'
import CanAccess from '@/components/ui/can-access'

interface AppointmentTypeEditProps {
  appointmentType: Tables<'appointment_types'>
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => void
}

export function AppointmentTypeEdit({
  appointmentType,
  open,
  onOpenChange,
  onSuccess,
}: AppointmentTypeEditProps) {
  const updateMutation = useAppointmentTypeUpdate()

  const form = useForm({
    resolver: zodResolver(appointmentTypeUpdateSchema),
    defaultValues: {
      name: appointmentType.name,
      description: appointmentType.description || '',
      color: appointmentType.color ?? '#3B82F6',
      is_active: appointmentType.is_active,
    },
  })

  const { handleSubmit, reset } = form

  const onSubmit = handleSubmit(async (data) => {
    await updateMutation.mutateAsync({
      id: appointmentType.id,
      data,
    })
    onOpenChange?.(false)
    onSuccess?.()
  })

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset()
    }
    onOpenChange?.(open)
  }

  return (
    <CanAccess resource="products" action="update">
      <FormSheet
        open={open as boolean}
        onOpenChange={handleOpenChange}
        title="Editar Tipo de Cita"
        description="Modifica los campos para actualizar el tipo de cita."
        form={form as any}
        onSubmit={onSubmit as any}
        isPending={updateMutation.isPending}
        submitLabel="Actualizar Tipo de Cita"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-2xl"
      >
        <AppointmentTypeForm />
        <Separator className="mt-4" />
      </FormSheet>
    </CanAccess>
  )
}
