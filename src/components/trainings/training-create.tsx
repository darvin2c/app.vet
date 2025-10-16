'use client'

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
} from '@/components/ui/drawer'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { TrainingForm } from './training-form'
import { TrainingSchema, TrainingFormData } from '@/schemas/trainings.schema'
import { useTrainingCreate } from '@/hooks/trainings/use-training-create'

interface TrainingCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  petId: string
}

export function TrainingCreate({
  open,
  onOpenChange,
  petId,
}: TrainingCreateProps) {
  const createTraining = useTrainingCreate()

  const onSuccess = () => {
    toast.success('Entrenamiento creado exitosamente')
    onOpenChange(false)
    form.reset()
  }

  const form = useForm<TrainingFormData>({
    resolver: zodResolver(TrainingSchema),
    defaultValues: {
      treatment_id: '',
      goal: '',
      sessions_planned: undefined,
      sessions_completed: undefined,
      trainer_id: '',
      progress_notes: '',
    },
  })

  const onSubmit = async (data: TrainingFormData) => {
    try {
      const trainingData = {
        ...data,
        goal: data.goal || null,
        progress_notes: data.progress_notes || null,
        trainer_id: data.trainer_id || null,
      }
      await createTraining.mutateAsync(trainingData)
      onSuccess?.()
    } catch (error) {
      console.error('Error creating training:', error)
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Nuevo Entrenamiento</DrawerTitle>
          <DrawerDescription>
            Programa un nuevo entrenamiento para la mascota
          </DrawerDescription>
        </DrawerHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-4">
            <TrainingForm />
          </form>
        </FormProvider>

        <DrawerFooter>
          <div className="flex gap-2">
            <ResponsiveButton
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </ResponsiveButton>
            <ResponsiveButton
              type="button"
              onClick={form.handleSubmit(onSubmit)}
              isLoading={createTraining.isPending}
              className="flex-1"
            >
              Crear Entrenamiento
            </ResponsiveButton>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
