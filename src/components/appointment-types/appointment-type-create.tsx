'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useAppointmentTypeCreate } from '@/hooks/appointment-types/use-appointment-type-create'
import { AppointmentTypeForm } from './appointment-type-form'
import { FormSheet } from '@/components/ui/form-sheet'
import { appointmentTypeCreateSchema } from '@/schemas/appointment-types.schema'
import CanAccess from '@/components/ui/can-access'

interface AppointmentTypeCreateProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function AppointmentTypeCreate({
  open,
  onOpenChange,
}: AppointmentTypeCreateProps) {
  const createMutation = useAppointmentTypeCreate()

  const form = useForm({
    resolver: zodResolver(appointmentTypeCreateSchema),
    defaultValues: {
      name: '',
      description: '',
      color: '#3B82F6',
      is_active: true,
    },
  })

  const { handleSubmit, reset } = form

  const onSubmit = handleSubmit(async (data) => {
    await createMutation.mutateAsync(data)
    reset()
    onOpenChange?.(false)
  })

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset()
    }
    onOpenChange?.(open)
  }

  return (
    <CanAccess resource="products" action="create">
      <FormSheet
        open={open as boolean}
        onOpenChange={handleOpenChange}
        title="Crear Tipo de Cita"
        description="Completa los campos para crear un nuevo tipo de cita."
        form={form as any}
        onSubmit={onSubmit as any}
        isPending={createMutation.isPending}
        submitLabel="Crear Tipo de Cita"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-2xl"
      >
        <div className="px-6">
          <AppointmentTypeForm />
        </div>
      </FormSheet>
    </CanAccess>
  )
}
