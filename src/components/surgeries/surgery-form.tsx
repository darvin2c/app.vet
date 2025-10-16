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
import { SurgeryFormData } from '@/schemas/surgeries.schema'

export function SurgeryForm() {
  // context
  const form = useFormContext<SurgeryFormData>()

  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel htmlFor="treatment_id">ID del Registro Médico</FieldLabel>
        <FieldContent>
          <Input
            id="treatment_id"
            {...form.register('treatment_id')}
            placeholder="ID del registro médico asociado"
          />
          <FieldError errors={[form.formState.errors.treatment_id]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="duration_min">Duración (minutos)</FieldLabel>
        <FieldContent>
          <Input
            id="duration_min"
            type="number"
            min="1"
            {...form.register('duration_min', { valueAsNumber: true })}
          />
          <FieldError errors={[form.formState.errors.duration_min]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="surgeon_notes">Notas del Cirujano</FieldLabel>
        <FieldContent>
          <Textarea
            id="surgeon_notes"
            {...form.register('surgeon_notes')}
            placeholder="Notas del cirujano sobre el procedimiento..."
          />
          <FieldError errors={[form.formState.errors.surgeon_notes]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="complications">Complicaciones</FieldLabel>
        <FieldContent>
          <Textarea
            id="complications"
            {...form.register('complications')}
            placeholder="Complicaciones durante o después de la cirugía..."
          />
          <FieldError errors={[form.formState.errors.complications]} />
        </FieldContent>
      </Field>
    </div>
  )
}
