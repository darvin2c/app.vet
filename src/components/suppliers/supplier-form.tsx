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

import { CreateSupplierSchema } from '@/schemas/suppliers.schema'

export function SupplierForm() {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<CreateSupplierSchema>()

  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel htmlFor="name">Nombre *</FieldLabel>
        <FieldContent>
          <Input
            id="name"
            placeholder="Nombre del proveedor"
            {...register('name')}
          />
          <FieldError errors={[errors.name]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="contact_person">Nombre de Contacto</FieldLabel>
        <FieldContent>
          <Input
            id="contact_person"
            placeholder="Nombre de la persona de contacto"
            {...register('contact_person')}
          />
          <FieldError errors={[errors.contact_person]} />
        </FieldContent>
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <FieldContent>
            <Input
              id="email"
              type="email"
              placeholder="email@ejemplo.com"
              {...register('email')}
            />
            <FieldError errors={[errors.email]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="phone">Teléfono</FieldLabel>
          <FieldContent>
            <Input
              id="phone"
              placeholder="Número de teléfono"
              {...register('phone')}
            />
            <FieldError errors={[errors.phone]} />
          </FieldContent>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="address">Dirección</FieldLabel>
        <FieldContent>
          <Input
            id="address"
            placeholder="Dirección completa"
            {...register('address')}
          />
          <FieldError errors={[errors.address]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="document_number">Número de Documento</FieldLabel>
        <FieldContent>
          <Input
            id="document_number"
            placeholder="Número de identificación fiscal"
            {...register('document_number')}
          />
          <FieldError errors={[errors.document_number]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="website">Sitio Web</FieldLabel>
        <FieldContent>
          <Input
            id="website"
            type="url"
            placeholder="https://ejemplo.com"
            {...register('website')}
          />
          <FieldError errors={[errors.website]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="notes">Notas</FieldLabel>
        <FieldContent>
          <Textarea
            id="notes"
            placeholder="Notas adicionales sobre el proveedor"
            {...register('notes')}
          />
          <FieldError errors={[errors.notes]} />
        </FieldContent>
      </Field>
    </div>
  )
}
