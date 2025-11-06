'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useAppointmentTypeUpdate } from '@/hooks/appointment-types/use-appointment-type-update'
import { AppointmentTypeForm } from './appointment-type-form'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import type { Tables } from '@/types/supabase.types'
import { toast } from 'sonner'
import { Form } from '../ui/form'
import { Separator } from '../ui/separator'
import { appointmentTypeUpdateSchema } from '@/schemas/appointment-types.schema'

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
    try {
      await updateMutation.mutateAsync({
        id: appointmentType.id,
        data,
      })
      toast.success('Tipo de cita actualizado', {
        description: 'El tipo de cita ha sido actualizado exitosamente.',
      })
      onOpenChange?.(false)
      onSuccess?.()
    } catch (error) {
      toast.error('Error', {
        description:
          'No se pudo actualizar el tipo de cita. Por favor, intenta de nuevo.',
      })
    }
  })

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset()
    }
    onOpenChange?.(open)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="!w-full !max-w-2xl">
        <SheetHeader>
          <SheetTitle>Editar Tipo de Cita</SheetTitle>
          <SheetDescription>
            Modifica los campos para actualizar el tipo de cita.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={onSubmit}>
            <AppointmentTypeForm />
            <Separator className="mt-4" />
            <SheetFooter className="flex-row">
              <ResponsiveButton
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                isLoading={updateMutation.isPending}
                isResponsive={false}
              >
                Cancelar
              </ResponsiveButton>
              <ResponsiveButton
                type="submit"
                isLoading={updateMutation.isPending}
                disabled={updateMutation.isPending}
                isResponsive={false}
              >
                Actualizar Tipo de Cita
              </ResponsiveButton>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
