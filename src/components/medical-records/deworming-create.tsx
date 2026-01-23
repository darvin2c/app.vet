'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { FormSheet } from '@/components/ui/form-sheet'
import { DewormingForm } from './deworming-form'
import {
  DewormingSchema,
  type DewormingFormData,
} from '@/schemas/deworming.schema'
import { useDewormingCreate } from '@/hooks/dewormings/use-deworming-create'
import CanAccess from '@/components/ui/can-access'

interface DewormingCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  medicalRecordId: string
  petId: string
}

export function DewormingCreate({
  open,
  onOpenChange,
  medicalRecordId,
  petId,
}: DewormingCreateProps) {
  const createDeworming = useDewormingCreate()

  const form = useForm<DewormingFormData>({
    resolver: zodResolver(DewormingSchema),
    defaultValues: {
      clinical_record_id: medicalRecordId,
      product: '',
      dose: '',
      route: '',
      next_due_at: undefined,
      adverse_event: '',
    },
  })

  const onSubmit = async (formData: DewormingFormData) => {
    try {
      await createDeworming.mutateAsync({
        ...formData,
        clinical_record_id: medicalRecordId,
      })
      toast.success('Desparasitación registrada exitosamente')
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Error al registrar desparasitación:', error)
      toast.error('Error al registrar la desparasitación')
    }
  }

  return (
    <CanAccess resource="clinical_records" action="update">
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Registrar Desparasitación"
        description="Agregue los detalles de la desparasitación"
        form={form}
        onSubmit={onSubmit}
        isPending={createDeworming.isPending}
        submitLabel="Guardar Desparasitación"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-2xl"
      >
        <DewormingForm />
      </FormSheet>
    </CanAccess>
  )
}
