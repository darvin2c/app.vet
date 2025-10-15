'use client'

import { useFormContext } from 'react-hook-form'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { VaccinationFormData } from '@/schemas/vaccinations.schema'

export function VaccinationForm() {
  const {
    register,
    formState: { errors },
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
          <Input
            id="next_due_at"
            type="datetime-local"
            {...register('next_due_at')}
          />
          <FieldError errors={[errors.next_due_at]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="adverse_event">Eventos Adversos</FieldLabel>
        <FieldContent>
          <Textarea
            id="adverse_event"
            placeholder="Describir cualquier reacción adversa observada..."
            rows={3}
            {...register('adverse_event')}
          />
          <FieldError errors={[errors.adverse_event]} />
        </FieldContent>
      </Field>
    </div>
  )
}
