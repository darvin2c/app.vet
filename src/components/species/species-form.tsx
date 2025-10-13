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
import { Checkbox } from '@/components/ui/checkbox'
import { SpeciesCreate } from '@/schemas/species.schema'

export function SpeciesForm() {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<SpeciesCreate>()

  const isActive = watch('is_active')

  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel htmlFor="name">Nombre de la Especie</FieldLabel>
        <FieldContent>
          <Input
            id="name"
            placeholder="Ej: Perro, Gato, Ave..."
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

      <Field>
        <FieldContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_active"
              checked={isActive}
              onCheckedChange={(checked) => setValue('is_active', !!checked)}
            />
            <FieldLabel htmlFor="is_active" className="text-sm font-normal">
              Especie activa
            </FieldLabel>
          </div>
          <FieldError errors={[errors.is_active]} />
        </FieldContent>
      </Field>
    </div>
  )
}
