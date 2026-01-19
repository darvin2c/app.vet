'use client'

import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { IsActiveFormField } from '@/components/ui/is-active-field'

export function ProductUnitForm() {
  const form = useFormContext()
  const {
    formState: { errors },
  } = form

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
            <FieldDescription>
              El nombre completo de la unidad (ej. Kilogramo, Litro).
            </FieldDescription>
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
            <FieldDescription>
              La abreviación usada para mostrar precios y cantidades (ej. kg,
              m).
            </FieldDescription>
            <FieldError errors={[errors.abbreviation]} />
          </FieldContent>
        </Field>
      </div>

      <IsActiveFormField />
    </div>
  )
}
