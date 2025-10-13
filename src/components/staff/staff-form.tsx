'use client'

import { useFormContext } from 'react-hook-form'
import { CreateStaffSchema, UpdateStaffSchema } from '@/schemas/staff.schema'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { SpecialtySelect } from '@/components/specialties/specialty-select'
import { IsActiveFormField } from '@/components/ui/is-active-field'

export function StaffForm() {
  const form = useFormContext<CreateStaffSchema | UpdateStaffSchema>()
  const { formState: { errors } } = form

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="full_name">Nombre Completo *</FieldLabel>
          <FieldContent>
            <Input
              id="full_name"
              placeholder="Ingresa el nombre completo"
              {...form.register('full_name')}
            />
            <FieldError errors={[errors.full_name]} />
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <IsActiveFormField />
    </div>
  )
}
