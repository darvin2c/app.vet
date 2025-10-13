'use client'

import { useFormContext } from 'react-hook-form'
import { CreateProductBrandSchema } from '@/schemas/product-brands.schema'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { IsActiveFormField } from '@/components/ui/is-active-field'
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldError,
} from '@/components/ui/field'

export function ProductBrandForm() {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateProductBrandSchema>()

  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel htmlFor="name">Nombre de la Marca *</FieldLabel>
        <FieldContent>
          <Input
            id="name"
            placeholder="Ingrese el nombre de la marca"
            {...control.register('name')}
          />
          <FieldError errors={[errors.name]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="description">Descripción</FieldLabel>
        <FieldContent>
          <Textarea
            id="description"
            placeholder="Descripción de la marca (opcional)"
            {...control.register('description')}
          />
          <FieldError errors={[errors.description]} />
        </FieldContent>
      </Field>

      <IsActiveFormField
        name="is_active"
        label="Estado de la Marca"
        description="Determina si la marca está activa en el sistema"
        activeText="Activo"
        inactiveText="Inactivo"
      />
    </div>
  )
}
