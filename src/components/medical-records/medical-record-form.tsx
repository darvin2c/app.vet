import { useFormContext } from 'react-hook-form'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { RichMinimalEditor } from '@/components/ui/rich-minimal-editor'
import { StaffSelect } from '@/components/staff/staff-select'
import { MedicalRecordFormData } from '@/schemas/medical-record.schema'
import { MedicalRecordTypeGrid } from './medical-record-type-grid'

import { VaccinationForm } from './vaccination-form'
import { SurgeryForm } from './surgery-form'

export function MedicalRecordForm() {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<MedicalRecordFormData>()
  const watchedType = watch('record_type')
  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel htmlFor="record_type">Tipo de Registro Médico</FieldLabel>
        <FieldContent>
          <MedicalRecordTypeGrid
            value={watchedType}
            onValueChange={(value) => setValue('record_type', value as any)}
          />
          <FieldError errors={[errors.record_type]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="vet_id">Veterinario</FieldLabel>
        <FieldContent>
          <StaffSelect
            value={watch('vet_id') || ''}
            onValueChange={(value) => setValue('vet_id', value)}
            placeholder="Seleccionar veterinario..."
          />
          <FieldError errors={[errors.vet_id]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="objective">Anamnesis y Exploración</FieldLabel>
        <FieldContent>
          <RichMinimalEditor
            value={watch('objective') || ''}
            onChange={(value) => setValue('objective', value)}
            placeholder="Objetivo de la consulta"
          />
          <FieldError errors={[errors.objective]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="diagnosis">Diagnóstico</FieldLabel>
        <FieldContent>
          <RichMinimalEditor
            value={watch('diagnosis') || ''}
            onChange={(value) => setValue('diagnosis', value)}
            placeholder="Diagnóstico del paciente"
          />
          <FieldError errors={[errors.diagnosis]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="plan">Tratamiento / Plan</FieldLabel>
        <FieldContent>
          <RichMinimalEditor
            value={watch('plan') || ''}
            onChange={(value) => setValue('plan', value)}
            placeholder="Plan de tratamiento"
          />
          <FieldError errors={[errors.plan]} />
        </FieldContent>
      </Field>

      {/* Formularios dinámicos basados en el tipo de registro médico - Solo tipos con respaldo en Supabase */}
      {watchedType === 'vaccination' && <VaccinationForm />}

      {watchedType === 'surgery' && <SurgeryForm />}
    </div>
  )
}
