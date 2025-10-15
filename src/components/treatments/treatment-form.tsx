import { useFormContext } from 'react-hook-form'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TreatmentFormData } from '@/schemas/treatment.schema'
import { TreatmentTypeGrid } from './treatment-type-grid'
import { ConsultationForm } from './consultation-form'
import { VaccinationForm } from './vaccination-form'
import { SurgeryForm } from './surgery-form'
import { TrainingForm } from './training-form'
import { HospitalizationForm } from './hospitalization-form'
import { BoardingForm } from './boarding-form'
import { GroomingForm } from './grooming-form'
import { DewormingForm } from './deworming-form'

export function TreatmentForm() {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<TreatmentFormData>()
  const watchedType = watch('treatment_type')
  const watchedStatus = watch('status')

  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel htmlFor="reason">Motivo</FieldLabel>
        <FieldContent>
          <Input
            id="reason"
            {...register('reason')}
            placeholder="Motivo del tratamiento"
          />
          <FieldError errors={[errors.reason]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="treatment_type">Tipo de Tratamiento</FieldLabel>
        <FieldContent>
          <TreatmentTypeGrid
            value={watchedType}
            onValueChange={(value) => setValue('treatment_type', value as any)}
          />
          <FieldError errors={[errors.treatment_type]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="status">Estado</FieldLabel>
        <FieldContent>
          <Select
            value={watchedStatus}
            onValueChange={(value) => setValue('status', value as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona el estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Borrador</SelectItem>
              <SelectItem value="completed">Completado</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
          <FieldError errors={[errors.status]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="treatment_date">Fecha del Tratamiento</FieldLabel>
        <FieldContent>
          <Input
            id="treatment_date"
            type="date"
            {...register('treatment_date')}
          />
          <FieldError errors={[errors.treatment_date]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="vet_id">Veterinario</FieldLabel>
        <FieldContent>
          <Input
            id="vet_id"
            {...register('vet_id')}
            placeholder="ID del veterinario"
          />
          <FieldError errors={[errors.vet_id]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="diagnosis">Diagnóstico</FieldLabel>
        <FieldContent>
          <Textarea
            id="diagnosis"
            {...register('diagnosis')}
            placeholder="Diagnóstico del tratamiento"
            rows={3}
          />
          <FieldError errors={[errors.diagnosis]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="notes">Notas</FieldLabel>
        <FieldContent>
          <Textarea
            id="notes"
            {...register('notes')}
            placeholder="Notas adicionales"
            rows={3}
          />
          <FieldError errors={[errors.notes]} />
        </FieldContent>
      </Field>

      {/* Formularios dinámicos basados en el tipo de tratamiento */}
      {watchedType === 'consultation' && (
        <ConsultationForm className="mt-6" />
      )}
      
      {watchedType === 'vaccination' && (
        <VaccinationForm className="mt-6" />
      )}
      
      {watchedType === 'surgery' && (
        <SurgeryForm className="mt-6" />
      )}
      
      {watchedType === 'training' && (
        <TrainingForm className="mt-6" />
      )}
      
      {watchedType === 'hospitalization' && (
        <HospitalizationForm className="mt-6" />
      )}
      
      {watchedType === 'boarding' && (
        <BoardingForm className="mt-6" />
      )}
      
      {watchedType === 'grooming' && (
        <GroomingForm className="mt-6" />
      )}
      
      {watchedType === 'deworming' && (
        <DewormingForm className="mt-6" />
      )}
    </div>
  )
}
