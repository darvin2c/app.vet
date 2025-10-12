'use client'

import { useState } from 'react'
import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import { TreatmentPlanItemForm } from './treatment-plan-item-form'
import { useTreatmentPlanItemAdd } from '@/hooks/treatment-plans/use-treatment-plan-item-add'
import { X, Check } from 'lucide-react'

const treatmentPlanItemSchema = z.object({
  procedure_id: z.string().nonempty('Debe seleccionar un procedimiento'),
  quantity: z.number().min(1, 'La cantidad debe ser mayor a 0'),
  unit_price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  description: z.string().optional(),
})

type TreatmentPlanItemFormData = z.infer<typeof treatmentPlanItemSchema>

interface TreatmentPlanItemAddProps {
  treatmentPlanId: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => void
}

export function TreatmentPlanItemAdd({
  treatmentPlanId,
  open = false,
  onOpenChange,
  onSuccess,
}: TreatmentPlanItemAddProps) {
  const form = useForm<TreatmentPlanItemFormData>({
    resolver: zodResolver(treatmentPlanItemSchema),
    defaultValues: {
      procedure_id: '',
      quantity: 1,
      unit_price: 0,
      description: '',
    },
  })

  const addTreatmentPlanItem = useTreatmentPlanItemAdd()

  const onSubmit: SubmitHandler<TreatmentPlanItemFormData> = async (data) => {
    try {
      await addTreatmentPlanItem.mutateAsync({
        plan_id: treatmentPlanId,
        ...data,
      })
      form.reset()
      onOpenChange?.(false)
      onSuccess?.()
    } catch (error) {
      console.error('Error al agregar procedimiento:', error)
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
          <DrawerTitle>Agregar Procedimiento</DrawerTitle>
          <DrawerDescription>
            Agrega un nuevo procedimiento al plan de tratamiento
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <TreatmentPlanItemForm />
            </form>
          </Form>
        </div>
        <DrawerFooter>
          <ResponsiveButton
            variant="outline"
            onClick={handleCancel}
            disabled={addTreatmentPlanItem.isPending}
            icon={X}
          >
            Cancelar
          </ResponsiveButton>
          <ResponsiveButton
            onClick={form.handleSubmit(onSubmit)}
            isLoading={addTreatmentPlanItem.isPending}
            icon={Check}
          >
            Agregar Procedimiento
          </ResponsiveButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
