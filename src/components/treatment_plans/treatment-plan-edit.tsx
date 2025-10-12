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
} from '@/components/ui/drawer-form'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { TreatmentPlanForm } from './treatment-plan-form'
import { TreatmentPlanWithRelations } from '@/hooks/treatment-plans/use-treatment-plans'
import useUpdateTreatmentPlan from '@/hooks/treatment-plans/use-update-treatment-plan'
import { updateTreatmentPlanSchema } from '@/schemas/treatment-plans.schema'
import { X, Check } from 'lucide-react'

interface TreatmentPlanEditProps {
  treatmentPlan: TreatmentPlanWithRelations
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => void
}

export function TreatmentPlanEdit({
  treatmentPlan,
  open = false,
  onOpenChange,
  onSuccess,
}: TreatmentPlanEditProps) {
  const form = useForm<any>({
    resolver: zodResolver(updateTreatmentPlanSchema),
    defaultValues: {
      title: treatmentPlan.title,
      patient_id: treatmentPlan.patient_id,
      staff_id: treatmentPlan.staff_id,
      notes: treatmentPlan.notes || '',
      status: treatmentPlan.status,
    },
  })

  const updateTreatmentPlan = useUpdateTreatmentPlan()

  const onSubmit: SubmitHandler<any> = async (data) => {
    try {
      await updateTreatmentPlan.mutateAsync({
        id: treatmentPlan.id,
        ...data,
        items: [],
      })
      onOpenChange?.(false)
      onSuccess?.()
    } catch (error) {
      console.error('Error al actualizar plan:', error)
    }
  }

  const handleCancel = () => {
    form.reset()
    onOpenChange?.(false)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!w-full !max-w-2xl">
        <DrawerHeader>
          <DrawerTitle>Editar Plan de Tratamiento</DrawerTitle>
          <DrawerDescription>
            Modifica los datos básicos del plan de tratamiento
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit as any)}
              className="space-y-6"
            >
              <TreatmentPlanForm />
            </form>
          </Form>
        </div>
        <DrawerFooter>
          <ResponsiveButton
            variant="outline"
            onClick={handleCancel}
            disabled={updateTreatmentPlan.isPending}
            icon={X}
          >
            Cancelar
          </ResponsiveButton>
          <ResponsiveButton
            onClick={form.handleSubmit(onSubmit as any)}
            isLoading={updateTreatmentPlan.isPending}
            icon={Check}
          >
            Actualizar Plan
          </ResponsiveButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
