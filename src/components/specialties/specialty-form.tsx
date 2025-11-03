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
import { Switch } from '@/components/ui/switch'
import { CreateSpecialtySchema } from '@/schemas/specialties.schema'

export function SpecialtyForm() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CreateSpecialtySchema>()

  const isActive = watch('is_active')

  return (
    <div className="space-y-4">
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
        <FieldLabel htmlFor="code">Código</FieldLabel>
        <FieldContent>
          <Input
            id="code"
            placeholder="Código de la especialidad"
            {...register('code')}
          />
          <FieldError errors={[errors.code]} />
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

      <Field>
        <FieldLabel htmlFor="is_active">Estado</FieldLabel>
        <FieldContent>
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={isActive}
              onCheckedChange={(checked) => setValue('is_active', checked)}
            />
            <span className="text-sm text-muted-foreground">
              {isActive ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          <FieldError errors={[errors.is_active]} />
        </FieldContent>
      </Field>
    </div>
  )
}