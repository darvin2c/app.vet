'use client'

import { useState } from 'react'
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
import { AppointmentTypeForm } from './appointment-type-form'
import {
  CreateAppointmentTypeSchema,
  createAppointmentTypeSchema,
} from '@/schemas/appointment-types.schema'
import { toast } from 'sonner'
import { X, Check } from 'lucide-react'
import { useAppointmentTypeCreate } from '@/hooks/appointment-types/use-appointment-type-create'

interface AppointmentTypeCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAppointmentTypeCreated?: (appointmentType: any) => void
}

export function AppointmentTypeCreate({
  open,
  onOpenChange,
  onAppointmentTypeCreated,
}: AppointmentTypeCreateProps) {
  const form = useForm<CreateAppointmentTypeSchema>({
    resolver: zodResolver(createAppointmentTypeSchema) as any,
    defaultValues: {
      name: '',
      code: '',
      color: '#3B82F6',
      active: true,
    },
  })

  const createAppointmentType = useAppointmentTypeCreate()

  const onSubmit: SubmitHandler<CreateAppointmentTypeSchema> = async (data) => {
    try {
      const newAppointmentType = await createAppointmentType.mutateAsync({
        name: data.name,
        code: data.code,
        color: data.color,
        active: data.active,
      })
      toast.success('Tipo de cita creado exitosamente')
      form.reset()
      onOpenChange(false)
      onAppointmentTypeCreated?.(newAppointmentType)
    } catch (error) {
      toast.error('Error al crear el tipo de cita')
      console.error('Error creating appointment type:', error)
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Nuevo Tipo de Cita</DrawerTitle>
          <DrawerDescription>
            Crea un nuevo tipo de cita médica
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit as any)}
              className="space-y-6"
            >
              <AppointmentTypeForm />
            </form>
          </Form>
        </div>
        <DrawerFooter>
          <ResponsiveButton
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={createAppointmentType.isPending}
            icon={X}
          >
            Cancelar
          </ResponsiveButton>
          <ResponsiveButton
            type="submit"
            onClick={form.handleSubmit(onSubmit as any)}
            isLoading={createAppointmentType.isPending}
            icon={Check}
          >
            Crear Tipo
          </ResponsiveButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
