'use client'

import { useFormContext } from 'react-hook-form'
import { CreateProductUnitSchema } from '@/schemas/product-units.schema'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { IsActiveFormField } from '@/components/ui/is-active-field'

export function ProductUnitForm() {
  const form = useFormContext<CreateProductUnitSchema>()
  const { formState: { errors } } = form

  return (
    <div className="space-y-4">
      <div className="">
        <Field>
          <FieldLabel htmlFor="name">Nombre *</FieldLabel>
          <FieldContent>
            <Input
              id="name"
              placeholder="Ingresa el nombre de la unidad"
              {...form.register('name')}
            />
            <FieldError errors={[errors.name]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="abbreviation">Abreviación *</FieldLabel>
          <FieldContent>
            <Input
              id="abbreviation"
              placeholder="Ingresa la abreviación de la unidad"
              {...form.register('abbreviation')}
            />
            <FieldError errors={[errors.abbreviation]} />
          </FieldContent>
        </Field>
      </div>

      <IsActiveFormField />
    </div>
  )
}
