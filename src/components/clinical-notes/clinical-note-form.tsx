'use client'

import { useFormContext } from 'react-hook-form'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { MedicalRecordSelect } from '@/components/medical-records/medical-record-select'
import { type ClinicalNoteFormData } from '@/schemas/clinical-notes.schema'

interface ClinicalNoteFormProps {
  petId?: string
}

export function ClinicalNoteForm({ petId }: ClinicalNoteFormProps) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<ClinicalNoteFormData>()

  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel htmlFor="content">Contenido</FieldLabel>
        <FieldContent>
          <Textarea
            id="content"
            {...register('content')}
            placeholder="Escriba las notas clínicas aquí..."
            rows={6}
          />
          <FieldError errors={[errors.content]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="clinical_record_id">Registro Médico</FieldLabel>
        <FieldContent>
          <MedicalRecordSelect
            value={watch('clinical_record_id') || undefined}
            onValueChange={(value: string | null) =>
              setValue('clinical_record_id', value || '')
            }
            petId={petId}
            placeholder="Seleccionar registro médico"
          />
          <FieldError errors={[errors.clinical_record_id]} />
        </FieldContent>
      </Field>
    </div>
  )
}
