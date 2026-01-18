'use client'

import { useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { FormSheet } from '@/components/ui/form-sheet'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { MedicalRecordForm } from './medical-record-form'
import { useMedicalRecordUpdate } from '@/hooks/medical-records/use-medical-record-update'
import {
  MedicalRecordSchema,
  MedicalRecordFormData,
} from '@/schemas/medical-record.schema'
import CanAccess from '@/components/ui/can-access'
import { Tables } from '@/types/supabase.types'

interface MedicalRecordEditProps {
  medicalRecord: Tables<'clinical_records'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MedicalRecordEdit({
  medicalRecord,
  open,
  onOpenChange,
}: MedicalRecordEditProps) {
  const updateMedicalRecord = useMedicalRecordUpdate()

  const form = useForm<MedicalRecordFormData>({
    resolver: zodResolver(MedicalRecordSchema),
    defaultValues: {
      pet_id: medicalRecord.pet_id,
      record_type: medicalRecord.record_type,
      record_date: medicalRecord.record_date?.split('T')[0] || '',
      reason: medicalRecord.reason || '',
      diagnosis: medicalRecord.diagnosis || '',
      vet_id: medicalRecord.vet_id || '',
      notes: medicalRecord.notes || '',
    },
  })

  useEffect(() => {
    if (medicalRecord) {
      form.reset({
        pet_id: medicalRecord.pet_id,
        record_type: medicalRecord.record_type,
        record_date: medicalRecord.record_date?.split('T')[0] || '',
        reason: medicalRecord.reason || '',
        diagnosis: medicalRecord.diagnosis || '',
        vet_id: medicalRecord.vet_id || '',
        notes: medicalRecord.notes || '',
      })
    }
  }, [medicalRecord, form])

  const onSubmit = async (data: MedicalRecordFormData) => {
    try {
      await updateMedicalRecord.mutateAsync({
        id: medicalRecord.id,
        data,
      })
      toast.success('Registro médico actualizado exitosamente')
      onOpenChange(false)
    } catch (error) {
      toast.error('Error al actualizar el registro médico')
    }
  }

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Editar Registro Médico"
      description="Modifica la información del registro médico"
      form={form as any}
      onSubmit={onSubmit as any}
      isPending={updateMedicalRecord.isPending}
      submitLabel="Actualizar Registro Médico"
      cancelLabel="Cancelar"
      side="right"
      className="!max-w-4xl"
    >
      <div className="px-4">
        <MedicalRecordForm />
        <ResponsiveButton type="submit" className="sr-only">
          Actualizar Registro Médico
        </ResponsiveButton>
      </div>
    </FormSheet>
  )
}
