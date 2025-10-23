'use client'

import { useFormContext } from 'react-hook-form'
import { useEffect } from 'react'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { MedicalRecordSelect } from '@/components/medical-records/medical-record-select'
import { type ClinicalNoteFormData } from '@/schemas/clinical-notes.schema'
import { StaffSelect } from '../staff/staff-select'

interface ClinicalNoteFormProps {
  petId: string
  clinicalRecordId?: string
}

export function ClinicalNoteForm({
  petId,
  clinicalRecordId,
}: ClinicalNoteFormProps) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<ClinicalNoteFormData>()

  // Determinar si el campo clinical_record_id debe estar deshabilitado
  const currentClinicalRecordId = watch('clinical_record_id')
  const isRecordIdDisabled = !!(clinicalRecordId || currentClinicalRecordId)

  // Establecer el valor del clinical_record_id si se pasa como prop
  useEffect(() => {
    if (clinicalRecordId && clinicalRecordId !== currentClinicalRecordId) {
      setValue('clinical_record_id', clinicalRecordId)
    }
  }, [clinicalRecordId, currentClinicalRecordId, setValue])

  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel htmlFor="vet_id">Veterinario</FieldLabel>
        <FieldContent>
          <StaffSelect
            value={watch('vet_id') || undefined}
            onValueChange={(value: string | null) =>
              setValue('vet_id', value || '')
            }
            placeholder="Seleccionar veterinario"
          />
          <FieldError errors={[errors.vet_id]} />
        </FieldContent>
      </Field>
      <Field>
        <FieldLabel htmlFor="clinical_record_id">Registro Médico</FieldLabel>
        <FieldContent>
          <MedicalRecordSelect
            value={clinicalRecordId || watch('clinical_record_id') || undefined}
            onValueChange={(value: string | null) =>
              setValue('clinical_record_id', value || '')
            }
            petId={petId}
            placeholder="Seleccionar registro médico"
            disabled={isRecordIdDisabled}
          />
          <FieldError errors={[errors.clinical_record_id]} />
        </FieldContent>
      </Field>
      <Field>
        <FieldLabel htmlFor="note">Nota Clínica</FieldLabel>
        <FieldContent>
          <Textarea
            id="note"
            {...register('note')}
            placeholder="Escriba las notas clínicas aquí..."
            rows={6}
          />
          <FieldError errors={[errors.note]} />
        </FieldContent>
      </Field>
    </div>
  )
}
