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
import { HospitalizationSelect } from '@/components/hospitalizations/hospitalization-select'
import { type ClinicalNoteFormData } from '@/schemas/clinical-notes.schema'

export function ClinicalNoteForm() {
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
        <FieldLabel htmlFor="medical_record_id">Registro Médico</FieldLabel>
        <FieldContent>
          <MedicalRecordSelect
            value={watch('medical_record_id') || undefined}
            onValueChange={(value: string | null) =>
              setValue('medical_record_id', value || '')
            }
            placeholder="Seleccionar registro médico"
          />
          <FieldError errors={[errors.medical_record_id]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="hospitalization_id">
          Hospitalización (Opcional)
        </FieldLabel>
        <FieldContent>
          <HospitalizationSelect
            value={watch('hospitalization_id') || undefined}
            onValueChange={(value: string | null) =>
              setValue('hospitalization_id', value || undefined)
            }
            placeholder="Seleccionar hospitalización"
          />
          <FieldError errors={[errors.hospitalization_id]} />
        </FieldContent>
      </Field>
    </div>
  )
}
