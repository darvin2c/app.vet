'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormSheet } from '@/components/ui/form-sheet'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { MedicalRecordForm } from './medical-record-form'
import { useMedicalRecordCreate } from '@/hooks/medical-records/use-medical-record-create'
import {
  MedicalRecordSchema,
  MedicalRecordFormData,
} from '@/schemas/medical-record.schema'
import CanAccess from '@/components/ui/can-access'

interface MedicalRecordCreateProps {
  petId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MedicalRecordCreate({
  petId,
  open,
  onOpenChange,
}: MedicalRecordCreateProps) {
  const createMedicalRecord = useMedicalRecordCreate()

  const form = useForm<MedicalRecordFormData>({
    resolver: zodResolver(MedicalRecordSchema),
    defaultValues: {
      pet_id: petId,
      record_type: 'consultation',
      record_date: new Date().toISOString().split('T')[0],
      reason: '',
      diagnosis: '',
      vet_id: '',
      notes: '',
    },
  })

  const onSubmit = async (data: MedicalRecordFormData) => {
    await createMedicalRecord.mutateAsync({
      ...data,
      pet_id: petId || data.pet_id,
    })
    onOpenChange(false)
  }

  return (
    <CanAccess resource="products" action="create">
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Nuevo Registro Médico"
        description="Registra un nuevo registro médico para la mascota"
        form={form as any}
        onSubmit={onSubmit as any}
        isPending={createMedicalRecord.isPending}
        submitLabel="Crear Registro Médico"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-4xl"
      >
        <div className="px-4">
          <MedicalRecordForm />
          <ResponsiveButton type="submit" className="sr-only">
            Crear Registro Médico
          </ResponsiveButton>
        </div>
      </FormSheet>
    </CanAccess>
  )
}
