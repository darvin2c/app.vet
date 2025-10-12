'use client'

import { useFormContext } from 'react-hook-form'
import { CreateSpecialtySchema } from '@/schemas/specialties.schema'
import { Input } from '@/components/ui/input'
import { IsActiveFormField } from '@/components/ui/is-active-field'
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldError,
} from '@/components/ui/field'

export function SpecialtyForm() {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateSpecialtySchema>()

  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel htmlFor="name">Nombre de la Especialidad *</FieldLabel>
        <FieldContent>
          <Input
            id="name"
            placeholder="Ingrese el nombre de la especialidad"
            {...control.register('name')}
          />
          <FieldError errors={[errors.name]} />
        </FieldContent>
      </Field>

      <IsActiveFormField
        name="is_active"
        label="Estado de la Especialidad"
        description="Determina si la especialidad está activa en el sistema"
        activeText="Activo"
        inactiveText="Inactivo"
      />
    </div>
  )
}
