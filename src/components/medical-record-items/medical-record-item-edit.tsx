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
} from '@/components/ui/drawer'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { MedicalRecordItemForm } from './medical-record-item-form'
import {
  MedicalRecordItemSchema,
  MedicalRecordItemFormData,
} from '@/schemas/medical-record-items.schema'
import { useMedicalRecordItemUpdate } from '@/hooks/medical-record-items/use-medical-record-item-update'
import { Tables } from '@/types/supabase.types'
import CanAccess from '@/components/ui/can-access'

interface MedicalRecordItemEditProps {
  medicalRecordItem: Tables<'record_items'>
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function MedicalRecordItemEdit({
  medicalRecordItem,
  trigger,
  open,
  onOpenChange,
}: MedicalRecordItemEditProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const updateMedicalRecordItem = useMedicalRecordItemUpdate()

  const isOpen = open ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen

  const form = useForm<MedicalRecordItemFormData>({
    resolver: zodResolver(MedicalRecordItemSchema),
    defaultValues: {
      record_id: medicalRecordItem.record_id,
      product_id: medicalRecordItem.product_id,
      qty: medicalRecordItem.qty,
      unit_price: medicalRecordItem.unit_price,
      notes: medicalRecordItem.notes || '',
    },
  })

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      form.reset({
        record_id: medicalRecordItem.record_id,
        product_id: medicalRecordItem.product_id,
        qty: medicalRecordItem.qty,
        unit_price: medicalRecordItem.unit_price,
        notes: medicalRecordItem.notes || '',
      })
    }
  }

  const onSubmit = async (data: MedicalRecordItemFormData) => {
    try {
      await updateMedicalRecordItem.mutateAsync({
        id: medicalRecordItem.id,
        data,
      })
      toast.success('Item de registro médico actualizado exitosamente')
      handleOpenChange(false)
    } catch (error) {
      toast.error('Error al actualizar el item de registro médico')
    }
  }

  useEffect(() => {
    if (isOpen) {
      form.reset({
        record_id: medicalRecordItem.record_id,
        product_id: medicalRecordItem.product_id,
        qty: medicalRecordItem.qty,
        unit_price: medicalRecordItem.unit_price,
        notes: medicalRecordItem.notes || '',
      })
    }
  }, [isOpen, medicalRecordItem, form])

  return (
    <>
      {trigger && <div onClick={() => setOpen(true)}>{trigger}</div>}

      <Drawer open={isOpen} onOpenChange={handleOpenChange}>
        <DrawerContent>
          <CanAccess resource="products" action="update">
            <DrawerHeader>
              <DrawerTitle>Editar Item de Registro Médico</DrawerTitle>
              <DrawerDescription>
                Modifica los detalles del item de registro médico
              </DrawerDescription>
            </DrawerHeader>

            <div className="px-4">
              <FormProvider {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <MedicalRecordItemForm />
                </form>
              </FormProvider>
            </div>

            <DrawerFooter>
              <ResponsiveButton
                type="button"
                isLoading={updateMedicalRecordItem.isPending}
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
          </CanAccess>
        </DrawerContent>
      </Drawer>
    </>
  )
}
