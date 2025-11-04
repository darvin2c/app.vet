'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FormProvider } from 'react-hook-form'
import { useAppointmentTypeCreate } from '@/hooks/appointment-types/use-appointment-type-create'
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
import {
  CreateAppointmentTypeSchema,
  createAppointmentTypeSchema,
} from '@/schemas/appointment-types.schema'
import { toast } from 'sonner'

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
    resolver: zodResolver(createAppointmentTypeSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
      duration_minutes: 30,
      color: '#3B82F6',
      is_active: true,
    },
  })

  const { handleSubmit, reset } = form

  const onSubmit = handleSubmit(async (data) => {
    try {
      await createMutation.mutateAsync(data as CreateAppointmentTypeSchema)
      toast.success('Tipo de cita creado', {
        description: 'El tipo de cita ha sido creado exitosamente.',
      })
      reset()
      onOpenChange?.(false)
    } catch (error) {
      toast.error('Error', {
        description:
          'No se pudo crear el tipo de cita. Por favor, intenta de nuevo.',
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
          <SheetTitle>Crear Tipo de Cita</SheetTitle>
          <SheetDescription>
            Completa los campos para crear un nuevo tipo de cita.
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
                isLoading={createMutation.isPending}
              >
                Cancelar
              </ResponsiveButton>
              <ResponsiveButton
                type="submit"
                isLoading={createMutation.isPending}
                disabled={createMutation.isPending}
              >
                Crear Tipo de Cita
              </ResponsiveButton>
            </SheetFooter>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  )
}
