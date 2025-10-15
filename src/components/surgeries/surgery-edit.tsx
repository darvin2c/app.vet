'use client'

import { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer-form'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { SurgeryForm } from './surgery-form'
import { SurgerySchema, SurgeryFormData } from '@/schemas/surgeries.schema'
import { useSurgeryUpdate } from '@/hooks/surgeries/use-surgery-update'
import { Tables } from '@/types/supabase.types'

interface SurgeryEditProps {
  surgery: Tables<'surgeries'>
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SurgeryEdit({
  surgery,
  trigger,
  open,
  onOpenChange,
}: SurgeryEditProps) {
  const [isOpen, setIsOpen] = useState(false)
  const updateSurgery = useSurgeryUpdate()

  const form = useForm<SurgeryFormData>({
    resolver: zodResolver(SurgerySchema),
    defaultValues: {
      treatment_id: surgery?.treatment_id || '',
      duration_min: surgery?.duration_min || undefined,
      surgeon_notes: surgery?.surgeon_notes || '',
      complications: surgery?.complications || '',
    },
  })

  useEffect(() => {
    if (surgery) {
      form.reset({
        treatment_id: surgery.treatment_id || '',
        duration_min: surgery.duration_min || undefined,
        surgeon_notes: surgery.surgeon_notes || '',
        complications: surgery.complications || '',
      })
    }
  }, [surgery, form])

  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open)
    } else {
      setIsOpen(open)
    }

    if (!open) {
      form.reset()
    }
  }

  const onSubmit = async (data: SurgeryFormData) => {
    try {
      await updateSurgery.mutateAsync({
        id: surgery.id,
        data,
      })
      toast.success('Cirugía actualizada exitosamente')
      handleOpenChange(false)
    } catch (error) {
      toast.error('Error al actualizar la cirugía')
      console.error('Error updating surgery:', error)
    }
  }

  const isControlled = open !== undefined && onOpenChange !== undefined
  const drawerOpen = isControlled ? open : isOpen

  return (
    <Drawer open={drawerOpen} onOpenChange={handleOpenChange}>
      {trigger}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Editar Cirugía</DrawerTitle>
          <DrawerDescription>
            Modificar información del procedimiento quirúrgico
          </DrawerDescription>
        </DrawerHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-4">
            <SurgeryForm />
          </form>
        </FormProvider>

        <DrawerFooter>
          <ResponsiveButton
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            isLoading={updateSurgery.isPending}
            disabled={updateSurgery.isPending}
          >
            Actualizar Cirugía
          </ResponsiveButton>
          <DrawerClose asChild>
            <ResponsiveButton variant="outline">Cancelar</ResponsiveButton>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
