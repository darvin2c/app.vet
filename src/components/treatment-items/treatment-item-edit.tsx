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
} from '@/components/ui/drawer'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { TreatmentItemForm } from './treatment-item-form'
import {
  TreatmentItemSchema,
  TreatmentItemFormData,
} from '@/schemas/treatment-items.schema'
import { useTreatmentItemUpdate } from '@/hooks/treatment-items/use-treatment-item-update'
import { Tables } from '@/types/supabase.types'

interface TreatmentItemEditProps {
  treatmentItem: Tables<'treatment_items'>
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function TreatmentItemEdit({
  treatmentItem,
  trigger,
  open,
  onOpenChange,
}: TreatmentItemEditProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const updateTreatmentItem = useTreatmentItemUpdate()

  const isOpen = open ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen

  const form = useForm<TreatmentItemFormData>({
    resolver: zodResolver(TreatmentItemSchema),
    defaultValues: {
      treatment_id: treatmentItem.treatment_id,
      product_id: treatmentItem.product_id,
      qty: treatmentItem.qty,
      unit_price: treatmentItem.unit_price,
      notes: treatmentItem.notes || '',
    },
  })

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      form.reset({
        treatment_id: treatmentItem.treatment_id,
        product_id: treatmentItem.product_id,
        qty: treatmentItem.qty,
        unit_price: treatmentItem.unit_price,
        notes: treatmentItem.notes || '',
      })
    }
  }

  const onSubmit = async (data: TreatmentItemFormData) => {
    try {
      await updateTreatmentItem.mutateAsync({
        id: treatmentItem.id,
        data,
      })
      toast.success('Item de tratamiento actualizado exitosamente')
      handleOpenChange(false)
    } catch (error) {
      toast.error('Error al actualizar el item de tratamiento')
    }
  }

  useEffect(() => {
    if (isOpen) {
      form.reset({
        treatment_id: treatmentItem.treatment_id,
        product_id: treatmentItem.product_id,
        qty: treatmentItem.qty,
        unit_price: treatmentItem.unit_price,
        notes: treatmentItem.notes || '',
      })
    }
  }, [isOpen, treatmentItem, form])

  return (
    <>
      {trigger && <div onClick={() => setOpen(true)}>{trigger}</div>}

      <Drawer open={isOpen} onOpenChange={handleOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Editar Item de Tratamiento</DrawerTitle>
            <DrawerDescription>
              Modifica los detalles del item de tratamiento
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4">
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <TreatmentItemForm />
              </form>
            </FormProvider>
          </div>

          <DrawerFooter>
            <ResponsiveButton
              type="button"
              isLoading={updateTreatmentItem.isPending}
              onClick={form.handleSubmit(onSubmit)}
            >
              Actualizar Item
            </ResponsiveButton>
            <ResponsiveButton
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancelar
            </ResponsiveButton>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
