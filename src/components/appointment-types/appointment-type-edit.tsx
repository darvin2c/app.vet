'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer-form'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { AppointmentTypeForm } from './appointment-type-form'
import { useUpdateAppointmentType } from '@/hooks/appointment-types/use-update-appointment-type'
import {
  UpdateAppointmentTypeSchema,
  updateAppointmentTypeSchema,
} from '@/schemas/appointment-types.schema'
import type { Tables } from '@/types/supabase.types'

type AppointmentType = Tables<'appointment_types'>

interface AppointmentTypeEditProps {
  appointmentType: AppointmentType
  open: boolean
  onOpenChange: (open: boolean) => void
  trigger?: React.ReactNode
  onSuccess?: () => void
}

export function AppointmentTypeEdit({
  appointmentType,
  open,
  onOpenChange,
  trigger,
  onSuccess,
}: AppointmentTypeEditProps) {
  const updateAppointmentType = useUpdateAppointmentType()

  const form = useForm<UpdateAppointmentTypeSchema>({
    resolver: zodResolver(updateAppointmentTypeSchema),
    defaultValues: {
      name: appointmentType.name,
      description: appointmentType.description || '',
      color: appointmentType.color || '#3B82F6',
      is_active: appointmentType.is_active,
    },
  })

  // Set form values when appointmentType changes
  useEffect(() => {
    if (appointmentType && open) {
      form.reset({
        name: appointmentType.name,
        description: appointmentType.description || '',
        color: appointmentType.color || '#3B82F6',
        is_active: appointmentType.is_active,
      })
    }
  }, [appointmentType, open, form])

  const onSubmit = async (data: UpdateAppointmentTypeSchema) => {
    await updateAppointmentType.mutateAsync({
      ...data,
      id: appointmentType.id,
    })
    onOpenChange(false)
    onSuccess?.()
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {trigger}
      <DrawerContent className="!w-full !max-w-4xl">
        <DrawerHeader>
          <DrawerTitle>Editar Tipo de Cita</DrawerTitle>
          <DrawerDescription>
            Modifica los datos del tipo de cita
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 overflow-y-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit as any)}
              className="space-y-4"
            >
              <AppointmentTypeForm />
            </form>
          </Form>
        </div>

        <DrawerFooter>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit as any)}
            disabled={updateAppointmentType.isPending}
          >
            {updateAppointmentType.isPending
              ? 'Actualizando...'
              : 'Actualizar Tipo'}
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updateAppointmentType.isPending}
          >
            Cancelar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
