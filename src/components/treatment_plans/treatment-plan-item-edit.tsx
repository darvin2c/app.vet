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
import { TreatmentPlanItemForm } from './treatment-plan-item-form'
import {
  TreatmentPlanItemWithRelations,
  useUpdateTreatmentPlanItem,
} from '@/hooks/treatment-plans/use-treatment-plan-items'
import { updateTreatmentPlanItemSchema } from '@/schemas/treatment-plans.schema'
import { X, Check } from 'lucide-react'

interface TreatmentPlanItemEditProps {
  treatmentPlanItem: TreatmentPlanItemWithRelations
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => void
  trigger?: React.ReactNode
}

export function TreatmentPlanItemEdit({
  treatmentPlanItem,
  open = false,
  onOpenChange,
  onSuccess,
  trigger,
}: TreatmentPlanItemEditProps) {
  const [internalOpen, setInternalOpen] = useState(false)

  const isOpen = open !== undefined ? open : internalOpen
  const handleOpenChange = (newOpen: boolean) => {
    if (open !== undefined) {
      onOpenChange?.(newOpen)
    } else {
      setInternalOpen(newOpen)
    }
  }

  const form = useForm<any>({
    resolver: zodResolver(updateTreatmentPlanItemSchema),
    defaultValues: {
      procedure_id: treatmentPlanItem.procedure_id,
      quantity: treatmentPlanItem.quantity,
      unit_price: treatmentPlanItem.unit_price,
      description: treatmentPlanItem.description || '',
    },
  })

  const updateTreatmentPlanItem = useUpdateTreatmentPlanItem()

  const onSubmit: SubmitHandler<any> = async (data) => {
    try {
      await updateTreatmentPlanItem.mutateAsync({
        id: treatmentPlanItem.id,
        ...data,
      })
      handleOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error('Error al actualizar procedimiento:', error)
    }
  }

  const handleCancel = () => {
    form.reset()
    handleOpenChange(false)
  }

  return (
    <>
      {trigger && <div onClick={() => handleOpenChange(true)}>{trigger}</div>}
      <Drawer open={isOpen} onOpenChange={handleOpenChange}>
        <DrawerContent className="!w-full !max-w-2xl">
          <DrawerHeader>
            <DrawerTitle>Editar Procedimiento</DrawerTitle>
            <DrawerDescription>
              Modifica los datos del procedimiento del plan de tratamiento
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit as any)}
                className="space-y-6"
              >
                <TreatmentPlanItemForm />
              </form>
            </Form>
          </div>
          <DrawerFooter>
            <ResponsiveButton
              variant="outline"
              onClick={handleCancel}
              disabled={updateTreatmentPlanItem.isPending}
              icon={X}
            >
              Cancelar
            </ResponsiveButton>
            <ResponsiveButton
              onClick={form.handleSubmit(onSubmit as any)}
              isLoading={updateTreatmentPlanItem.isPending}
              icon={Check}
            >
              Actualizar Tratamiento
            </ResponsiveButton>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
