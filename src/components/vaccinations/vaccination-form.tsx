'use client'

import { useFormContext } from 'react-hook-form'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { DatePicker } from '@/components/ui/date-picker'
import { RichMinimalEditor } from '@/components/ui/rich-minimal-editor'
import { VaccinationFormData } from '@/schemas/vaccinations.schema'

export function VaccinationForm() {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<VaccinationFormData>()

  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel htmlFor="dose">Dosis</FieldLabel>
        <FieldContent>
          <Input
            id="dose"
            placeholder="Ej: Primera dosis, Refuerzo anual..."
            {...register('dose')}
          />
          <FieldError errors={[errors.dose]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="route">Vía de Administración</FieldLabel>
        <FieldContent>
          <Input
            id="route"
            placeholder="Ej: Subcutánea, Intramuscular..."
            {...register('route')}
          />
          <FieldError errors={[errors.route]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="site">Sitio de Aplicación</FieldLabel>
        <FieldContent>
          <Input
            id="site"
            placeholder="Ej: Cuello, Muslo posterior..."
            {...register('site')}
          />
          <FieldError errors={[errors.site]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="next_due_at">
          Próxima Fecha de Vencimiento
        </FieldLabel>
        <FieldContent>
          <DatePicker
            id="next_due_at"
            name="next_due_at"
            value={
              watch('next_due_at') ? new Date(watch('next_due_at')!) : undefined
            }
            onChange={(value) => setValue('next_due_at', value?.toISOString())}
            error={!!errors.next_due_at}
            errorMessage={errors.next_due_at?.message as string}
          />
          <FieldError errors={[errors.next_due_at]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="adverse_event">Eventos Adversos</FieldLabel>
        <FieldContent>
          <RichMinimalEditor
            value={watch('adverse_event') || ''}
            onChange={(value) => setValue('adverse_event', value)}
            placeholder="Describir cualquier reacción adversa observada..."
          />
          <FieldError errors={[errors.adverse_event]} />
        </FieldContent>
      </Field>
    </div>
  )
}
