'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { FormSheet } from '@/components/ui/form-sheet'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { MedicalRecordItemForm } from './medical-record-item-form'
import {
  MedicalRecordItemSchema,
  MedicalRecordItemFormData,
} from '@/schemas/medical-record-items.schema'
import { useMedicalRecordItemCreate } from '@/hooks/medical-record-items/use-medical-record-item-create'
import CanAccess from '@/components/ui/can-access'

interface MedicalRecordItemCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  medicalRecordId: string
}

export function MedicalRecordItemCreate({
  open,
  onOpenChange,
  medicalRecordId,
}: MedicalRecordItemCreateProps) {
  const createMedicalRecordItem = useMedicalRecordItemCreate()

  const form = useForm<MedicalRecordItemFormData>({
    resolver: zodResolver(MedicalRecordItemSchema),
    defaultValues: {
      record_id: medicalRecordId,
      product_id: '',
      qty: 1,
      unit_price: 0,
      notes: '',
    },
  })

  const onSubmit = async (data: MedicalRecordItemFormData) => {
    try {
      await createMedicalRecordItem.mutateAsync({
        ...data,
      })
      toast.success('Item de registro médico agregado exitosamente')
      onOpenChange(false)
      form.reset()
    } catch (error) {
      toast.error('Error al agregar el item de registro médico')
    }
  }

  return (
    <CanAccess resource="products" action="create">
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Agregar Item de Registro Médico"
        description="Agrega un nuevo item al registro médico"
        form={form as any}
        onSubmit={onSubmit as any}
        isPending={createMedicalRecordItem.isPending}
        submitLabel="Agregar Item"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-xl"
      >
        <div className="px-4">
          <MedicalRecordItemForm />
          <ResponsiveButton type="submit" className="sr-only">
            Agregar Item
          </ResponsiveButton>
        </div>
      </FormSheet>
    </CanAccess>
  )
}
