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
import { TrainingForm } from './training-form'
import { TrainingSchema, TrainingFormData } from '@/schemas/trainings.schema'
import { useTrainingUpdate } from '@/hooks/trainings/use-training-update'
import { Tables } from '@/types/supabase.types'

interface TrainingEditProps {
  training: Tables<'trainings'>
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function TrainingEdit({
  training,
  trigger,
  open,
  onOpenChange,
}: TrainingEditProps) {
  const [isOpen, setIsOpen] = useState(false)
  const updateTraining = useTrainingUpdate()

  const form = useForm<TrainingFormData>({
    resolver: zodResolver(TrainingSchema),
    defaultValues: {
      medical_record_id: training?.medical_record_id || '',
      goal: training?.goal || '',
      sessions_planned: training?.sessions_planned || undefined,
      sessions_completed: training?.sessions_completed || undefined,
      trainer_id: training?.trainer_id || '',
      progress_notes: training?.progress_notes || '',
    },
  })

  useEffect(() => {
    if (training) {
      form.reset({
        medical_record_id: training.medical_record_id || '',
        goal: training.goal || '',
        sessions_planned: training.sessions_planned || undefined,
        sessions_completed: training.sessions_completed || undefined,
        trainer_id: training.trainer_id || '',
        progress_notes: training.progress_notes || '',
      })
    }
  }, [training, form])

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

  const onSubmit = async (data: TrainingFormData) => {
    try {
      await updateTraining.mutateAsync({
        id: training.id,
        data,
      })
      toast.success('Entrenamiento actualizado exitosamente')
      handleOpenChange(false)
    } catch (error) {
      toast.error('Error al actualizar el entrenamiento')
      console.error('Error updating training:', error)
    }
  }

  const isControlled = open !== undefined && onOpenChange !== undefined
  const drawerOpen = isControlled ? open : isOpen

  return (
    <Drawer open={drawerOpen} onOpenChange={handleOpenChange}>
      {trigger}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Editar Entrenamiento</DrawerTitle>
          <DrawerDescription>
            Modificar información del programa de entrenamiento
          </DrawerDescription>
        </DrawerHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-4">
            <TrainingForm />
          </form>
        </FormProvider>

        <DrawerFooter>
          <ResponsiveButton
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            isLoading={updateTraining.isPending}
            disabled={updateTraining.isPending}
          >
            Actualizar Entrenamiento
          </ResponsiveButton>
          <DrawerClose asChild>
            <ResponsiveButton variant="outline">Cancelar</ResponsiveButton>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
