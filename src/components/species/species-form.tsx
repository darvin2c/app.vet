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
import { IsActiveFormField } from '@/components/ui/is-active-field'
import { SpeciesCreate } from '@/schemas/species.schema'

export function SpeciesForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<SpeciesCreate>()

  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel htmlFor="name">Nombre de la Especie</FieldLabel>
        <FieldContent>
          <Input
            id="name"
            placeholder="Ej: Canino, Felino..."
            {...register('name')}
          />
          <FieldError errors={[errors.name]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="description">Descripción</FieldLabel>
        <FieldContent>
          <Textarea
            id="description"
            placeholder="Descripción opcional de la especie..."
            rows={3}
            {...register('description')}
          />
          <FieldError errors={[errors.description]} />
        </FieldContent>
      </Field>

      <IsActiveFormField name="is_active" label="Especie activa" />
    </div>
  )
}
