import { useFormContext } from 'react-hook-form'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TreatmentFormData } from '@/schemas/treatment.schema'
import { TreatmentTypeGrid } from './treatment-type-grid'

import { VaccinationForm } from './vaccination-form'
import { SurgeryForm } from './surgery-form'
import { TrainingForm } from './training-form'
import { BoardingForm } from './boarding-form'

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

      {/* Formularios dinámicos basados en el tipo de tratamiento - Solo tipos con respaldo en Supabase */}
      {watchedType === 'vaccination' && <VaccinationForm />}

      {watchedType === 'surgery' && <SurgeryForm />}

      {watchedType === 'training' && <TrainingForm />}

      {watchedType === 'boarding' && <BoardingForm />}
    </div>
  )
}
