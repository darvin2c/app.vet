'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FormProvider } from 'react-hook-form'
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
import type { AppointmentType } from '@/types/supabase.types'
import {
  UpdateAppointmentTypeSchema,
  updateAppointmentTypeSchema,
} from '@/schemas/appointment-types.schema'
import { toast } from 'sonner'

interface AppointmentTypeEditProps {
  appointmentType: AppointmentType
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

  const form = useForm<UpdateAppointmentTypeSchema>({
    resolver: zodResolver(updateAppointmentTypeSchema),
    defaultValues: {
      name: appointmentType.name,
      code: appointmentType.code || '',
      description: appointmentType.description || '',
      duration_minutes: appointmentType.duration_minutes,
      color: appointmentType.color ?? '#3B82F6',
      is_active: appointmentType.is_active,
    },
  })

  const { handleSubmit, reset } = form

  const onSubmit = handleSubmit(async (data: UpdateAppointmentTypeSchema) => {
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
      <SheetContent className="sm:max-w-[500px]">
        <SheetHeader>
          <SheetTitle>Editar Tipo de Cita</SheetTitle>
          <SheetDescription>
            Modifica los campos para actualizar el tipo de cita.
          </SheetDescription>
        </SheetHeader>

        <FormProvider {...form}>
          <form
            onSubmit={onSubmit}
            className="flex flex-col h-[calc(100%-4rem)]"
          >
            <div className="flex-1 overflow-y-auto py-4">
              <AppointmentTypeForm />
            </div>

            <SheetFooter>
              <ResponsiveButton
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                isLoading={updateMutation.isPending}
              >
                Cancelar
              </ResponsiveButton>
              <ResponsiveButton
                type="submit"
                isLoading={updateMutation.isPending}
                disabled={updateMutation.isPending}
              >
                Actualizar Tipo de Cita
              </ResponsiveButton>
            </SheetFooter>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  )
}
