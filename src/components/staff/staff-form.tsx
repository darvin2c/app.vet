'use client'

import { useFormContext, Controller } from 'react-hook-form'
import { CreateStaffSchema, UpdateStaffSchema } from '@/schemas/staff.schema'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { IsActiveFormField } from '@/components/ui/is-active-field'
import { UserSelect } from '../users/user-select'

export function StaffForm() {
  const form = useFormContext<CreateStaffSchema | UpdateStaffSchema>()
  const {
    control,
    formState: { errors },
  } = form

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="first_name">Nombre *</FieldLabel>
          <FieldContent>
            <Input
              id="first_name"
              type="text"
              {...form.register('first_name')}
            />
            <FieldError errors={[errors.first_name]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="last_name">Apellido *</FieldLabel>
          <FieldContent>
            <Input id="last_name" type="text" {...form.register('last_name')} />
            <FieldError errors={[errors.last_name]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <FieldContent>
            <Input
              id="email"
              type="email"
              placeholder="ejemplo@correo.com"
              {...form.register('email')}
            />
            <FieldError errors={[errors.email]} />
          </FieldContent>
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="phone">Teléfono</FieldLabel>
          <FieldContent>
            <Input
              id="phone"
              placeholder="+51 999 999 999"
              {...form.register('phone')}
            />
            <FieldError errors={[errors.phone]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="license_number">Número de Licencia</FieldLabel>
          <FieldContent>
            <Input
              id="license_number"
              placeholder="Ingresa el número de licencia"
              {...form.register('license_number')}
            />
            <FieldError errors={[errors.license_number]} />
          </FieldContent>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="user_id">Usuario</FieldLabel>
        <FieldContent>
          <Controller
            name="user_id"
            control={control}
            render={({ field }) => (
              <UserSelect
                value={field.value || ''}
                onValueChange={field.onChange}
                placeholder="Seleccionar usuario..."
              />
            )}
          />
          <FieldError errors={[errors.user_id]} />
        </FieldContent>
      </Field>

      <IsActiveFormField />
    </div>
  )
}
