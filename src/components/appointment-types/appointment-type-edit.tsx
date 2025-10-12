'use client'

import { useState, useEffect } from 'react'
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
import { useUpdateAppointmentType } from '@/hooks/appointment-types/use-update-appointment-type'
import {
  UpdateAppointmentTypeSchema,
  updateAppointmentTypeSchema,
} from '@/schemas/appointment-types.schema'
import type { Tables } from '@/types/supabase.types'
import { toast } from 'sonner'
import { X, Check } from 'lucide-react'

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
  const form = useForm<UpdateAppointmentTypeSchema>({
    resolver: zodResolver(updateAppointmentTypeSchema),
  })

  const updateAppointmentType = useUpdateAppointmentType()

  // Set form values when appointmentType changes
  useEffect(() => {
    if (appointmentType && open) {
      form.reset({
        name: appointmentType.name,
        code: appointmentType.code || '',
        color: appointmentType.color || '#3B82F6',
        active: appointmentType.active,
      })
    }
  }, [appointmentType, open, form])

  const onSubmit: SubmitHandler<UpdateAppointmentTypeSchema> = async (data) => {
    try {
      await updateAppointmentType.mutateAsync({
        ...data,
        id: appointmentType.id,
      })
      toast.success('Tipo de cita actualizado exitosamente')
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      toast.error('Error al actualizar el tipo de cita')
      console.error('Error updating appointment type:', error)
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {trigger}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Editar Tipo de Cita</DrawerTitle>
          <DrawerDescription>
            Modifica los datos del tipo de cita
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <AppointmentTypeForm />
            </form>
          </Form>
        </div>
        <DrawerFooter>
          <ResponsiveButton
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updateAppointmentType.isPending}
            icon={X}
          >
            Cancelar
          </ResponsiveButton>
          <ResponsiveButton
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            isLoading={updateAppointmentType.isPending}
            icon={Check}
          >
            Actualizar Tipo
          </ResponsiveButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
