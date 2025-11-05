'use client'

import { useFormContext, Controller } from 'react-hook-form'
import { CreateStaffSchema, UpdateStaffSchema } from '@/schemas/staff.schema'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldSeparator,
  FieldDescription,
} from '@/components/ui/field'
import { IsActiveFormField } from '@/components/ui/is-active-field'
import { UserSelect } from '../users/user-select'
import PhoneInput from '../ui/phone-input'
import { AddressInput } from '../ui/address-input'

export function StaffForm() {
  const form = useFormContext<CreateStaffSchema | UpdateStaffSchema>()
  const {
    control,
    formState: { errors },
  } = form

  return (
    <FieldGroup>
      {/* Datos personales */}
      <FieldSet>
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
      </FieldSet>

      {/* Contacto */}
      <FieldSet>
        <FieldLegend>Contacto</FieldLegend>
        <FieldDescription>
          Ingrese los datos de contacto del personal.
        </FieldDescription>
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

        <Field>
          <FieldLabel htmlFor="phone">Teléfono</FieldLabel>
          <FieldContent>
            <PhoneInput
              value={form.watch('phone') || ''}
              onChange={(value) =>
                form.setValue('phone', value, { shouldValidate: true })
              }
              placeholder="Ingrese número de teléfono"
              variant="form"
            />
            <FieldError errors={[errors.phone]} />
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel htmlFor="address">Dirección</FieldLabel>
          <FieldContent>
            <AddressInput
              value={form.watch('address') || ''}
              onChange={(value) =>
                form.setValue('address', value, { shouldValidate: true })
              }
              placeholder="Ingrese dirección"
            />
            <FieldError errors={[errors.address]} />
          </FieldContent>
        </Field>
      </FieldSet>

      <FieldSeparator />

      {/* Profesional */}
      <FieldSet>
        <FieldLegend>Profesional</FieldLegend>
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
      </FieldSet>

      {/* Cuenta */}
      <FieldSet>
        <FieldLegend>Cuenta</FieldLegend>
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
      </FieldSet>

      {/* Estado */}
      <FieldSet>
        <FieldLegend>Estado</FieldLegend>
        <IsActiveFormField />
      </FieldSet>
    </FieldGroup>
  )
}
