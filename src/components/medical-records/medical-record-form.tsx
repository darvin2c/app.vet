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
import { DatePicker } from '@/components/ui/date-picker'
import { MedicalRecordFormData } from '@/schemas/medical-record.schema'
import { MedicalRecordTypeGrid } from './medical-record-type-grid'

import { VaccinationForm } from './vaccination-form'
import { SurgeryForm } from './surgery-form'
import { TrainingForm } from './training-form'
import { BoardingForm } from './boarding-form'

export function MedicalRecordForm() {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<MedicalRecordFormData>()
  const watchedType = watch('type')
  const watchedStatus = watch('status')

  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel htmlFor="type">Tipo de Registro Médico</FieldLabel>
        <FieldContent>
          <MedicalRecordTypeGrid
            value={watchedType}
            onValueChange={(value) => setValue('type', value as any)}
          />
          <FieldError errors={[errors.type]} />
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
        <FieldLabel htmlFor="date">Fecha del Registro</FieldLabel>
        <FieldContent>
          <DatePicker
            id="date"
            name="date"
            value={watch('date')}
            onChange={(value) => setValue('date', value?.toISOString() || '')}
            hasTime={false}
          />
          <FieldError errors={[errors.date]} />
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
        <FieldLabel htmlFor="notes">Notas</FieldLabel>
        <FieldContent>
          <Input
            id="notes"
            {...register('notes')}
            placeholder="Notas adicionales"
          />
          <FieldError errors={[errors.notes]} />
        </FieldContent>
      </Field>

      {/* Formularios dinámicos basados en el tipo de registro médico - Solo tipos con respaldo en Supabase */}
      {watchedType === 'vaccination' && <VaccinationForm />}

      {watchedType === 'surgery' && <SurgeryForm />}

      {watchedType === 'training' && <TrainingForm />}

      {watchedType === 'boarding' && <BoardingForm />}
    </div>
  )
}
