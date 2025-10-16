import { useFormContext } from 'react-hook-form'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DatePicker } from '@/components/ui/date-picker'
import { HospitalizationSchema } from '@/schemas/hospitalization.schema'

export function HospitalizationForm() {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<HospitalizationSchema>()

  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel htmlFor="admission_at">Fecha de Ingreso</FieldLabel>
        <FieldContent>
          <DatePicker
            id="admission_at"
            name="admission_at"
            value={watch('admission_at')}
            onChange={(value) => setValue('admission_at', value || '')}
            placeholder="Seleccionar fecha y hora de ingreso"
            hasTime={true}
            error={errors.admission_at?.message as string}
          />
          <FieldError errors={[errors.admission_at]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="discharge_at">Fecha de Alta</FieldLabel>
        <FieldContent>
          <DatePicker
            id="discharge_at"
            name="discharge_at"
            value={watch('discharge_at')}
            onChange={(value) => setValue('discharge_at', value || '')}
            placeholder="Seleccionar fecha y hora de alta"
            hasTime={true}
            error={errors.discharge_at?.message as string}
          />
          <FieldError errors={[errors.discharge_at]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="bed_id">Cama/Habitación</FieldLabel>
        <FieldContent>
          <Input
            id="bed_id"
            {...register('bed_id')}
            placeholder="Número de cama o habitación"
          />
          <FieldError errors={[errors.bed_id]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="daily_rate">Tarifa Diaria</FieldLabel>
        <FieldContent>
          <Input
            id="daily_rate"
            type="number"
            step="0.01"
            min="0"
            {...register('daily_rate', { valueAsNumber: true })}
            placeholder="0.00"
          />
          <FieldError errors={[errors.daily_rate]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="notes">Notas</FieldLabel>
        <FieldContent>
          <Textarea
            id="notes"
            {...register('notes')}
            placeholder="Observaciones, instrucciones especiales, etc."
            rows={4}
          />
          <FieldError errors={[errors.notes]} />
        </FieldContent>
      </Field>
    </div>
  )
}
