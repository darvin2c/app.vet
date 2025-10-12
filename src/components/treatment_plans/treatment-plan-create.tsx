'use client'

import { useState } from 'react'
import React from 'react'
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
  DrawerTrigger,
} from '@/components/ui/drawer-form'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { TreatmentPlanForm } from './treatment-plan-form'
import useCreateTreatmentPlan from '@/hooks/treatment-plans/use-create-treatment-plan'
import { createTreatmentPlanSchema } from '@/schemas/treatment-plans.schema'
import { X, Check } from 'lucide-react'

interface TreatmentPlanCreateProps {
  trigger?: React.ReactNode
  onSuccess?: () => void
  defaultPatientId?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function TreatmentPlanCreate({
  trigger,
  onSuccess,
  defaultPatientId,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: TreatmentPlanCreateProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen

  const handleOpenChange = (newOpen: boolean) => {
    if (controlledOpen !== undefined) {
      controlledOnOpenChange?.(newOpen)
    } else {
      setInternalOpen(newOpen)
    }
  }

  const form = useForm<any>({
    resolver: zodResolver(createTreatmentPlanSchema),
    defaultValues: {
      patient_id: defaultPatientId || '',
      staff_id: '',
      title: '',
      notes: '',
      status: 'draft',
    },
  })

  // Update form values when default props change
  React.useEffect(() => {
    if (defaultPatientId) {
      form.setValue('patient_id', defaultPatientId)
    }
  }, [defaultPatientId, form])

  const createTreatmentPlan = useCreateTreatmentPlan()

  const onSubmit: SubmitHandler<any> = async (data) => {
    try {
      const result = await createTreatmentPlan.mutateAsync(data)
      form.reset()
      handleOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error('Error al crear plan:', error)
    }
  }

  const handleCancel = () => {
    form.reset()
    handleOpenChange(false)
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="!w-full !max-w-2xl">
        <DrawerHeader>
          <DrawerTitle>Nuevo Plan de Tratamiento</DrawerTitle>
          <DrawerDescription>
            Crea un nuevo plan de tratamiento básico. Los procedimientos se
            pueden agregar después.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit as any)}
              className="space-y-6"
            >
              <TreatmentPlanForm disablePatientSelection={!!defaultPatientId} />
            </form>
          </Form>
        </div>
        <DrawerFooter>
          <ResponsiveButton
            variant="outline"
            onClick={handleCancel}
            disabled={createTreatmentPlan.isPending}
            icon={X}
          >
            Cancelar
          </ResponsiveButton>
          <ResponsiveButton
            onClick={form.handleSubmit(onSubmit as any)}
            isLoading={createTreatmentPlan.isPending}
            icon={Check}
          >
            Crear Plan
          </ResponsiveButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
