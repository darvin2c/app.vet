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
import { Form } from '../ui/form'

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
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="!w-full !max-w-2xl">
        <SheetHeader>
          <SheetTitle>Crear Tipo de Cita</SheetTitle>
          <SheetDescription>
            Completa los campos para crear un nuevo tipo de cita.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="px-6">
              <AppointmentTypeForm />
            </div>

            <SheetFooter className="flex-row">
              <ResponsiveButton
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                isLoading={createMutation.isPending}
                isResponsive={false}
              >
                Cancelar
              </ResponsiveButton>
              <ResponsiveButton
                type="submit"
                isLoading={createMutation.isPending}
                disabled={createMutation.isPending}
                isResponsive={false}
              >
                Crear Tipo de Cita
              </ResponsiveButton>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
