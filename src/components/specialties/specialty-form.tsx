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
import { IsActiveField } from '../ui/is-active-field'

export function SpecialtyForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <div className="px-2">
      <Field>
        <FieldLabel htmlFor="name">Nombre *</FieldLabel>
        <FieldContent>
          <Input
            id="name"
            placeholder="Nombre de la especialidad"
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
            placeholder="Descripción de la especialidad"
            {...register('description')}
          />
          <FieldError errors={[errors.description]} />
        </FieldContent>
      </Field>

      <IsActiveField
        name="is_active"
        label="Estado Activo"
        description="Indica si la especialidad está activa o inactiva."
      />
    </div>
  )
}
