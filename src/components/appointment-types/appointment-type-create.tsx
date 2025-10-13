'use client'

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
import {
  CreateAppointmentTypeSchema,
  createAppointmentTypeSchema,
} from '@/schemas/appointment-types.schema'
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
  const createAppointmentType = useAppointmentTypeCreate()

  const form = useForm<CreateAppointmentTypeSchema>({
    resolver: zodResolver(createAppointmentTypeSchema),
    defaultValues: {
      name: '',
      description: '',
      duration_minutes: 30,
      color: '#3B82F6',
      is_active: true,
    },
  })

  const onSubmit = async (data: CreateAppointmentTypeSchema) => {
    const newAppointmentType = await createAppointmentType.mutateAsync({
      name: data.name,
      description: data.description,
      color: data.color,
      is_active: data.is_active,
    })
    form.reset()
    onOpenChange(false)
    onAppointmentTypeCreated?.(newAppointmentType)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!max-w-4xl">
        <DrawerHeader>
          <DrawerTitle>Nuevo Tipo de Cita</DrawerTitle>
          <DrawerDescription>
            Crea un nuevo tipo de cita médica
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4">
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
            disabled={createAppointmentType.isPending}
          >
            {createAppointmentType.isPending ? 'Creando...' : 'Crear Tipo'}
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={createAppointmentType.isPending}
          >
            Cancelar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
