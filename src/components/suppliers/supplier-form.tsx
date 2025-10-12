'use client'

import { useFormContext } from 'react-hook-form'
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { CreateSupplierSchema } from '@/schemas/suppliers.schema'

export function SupplierForm() {
  const { register, formState: { errors }, setValue, watch } = useFormContext<CreateSupplierSchema>()
  
  const isActive = watch('is_active')

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
        <FieldLabel htmlFor="contact_name">Nombre de Contacto</FieldLabel>
        <FieldContent>
          <Input
            id="contact_name"
            placeholder="Nombre de la persona de contacto"
            {...register('contact_name')}
          />
          <FieldError errors={[errors.contact_name]} />
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field>
          <FieldLabel htmlFor="city">Ciudad</FieldLabel>
          <FieldContent>
            <Input
              id="city"
              placeholder="Ciudad"
              {...register('city')}
            />
            <FieldError errors={[errors.city]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="state">Estado/Provincia</FieldLabel>
          <FieldContent>
            <Input
              id="state"
              placeholder="Estado o provincia"
              {...register('state')}
            />
            <FieldError errors={[errors.state]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="postal_code">Código Postal</FieldLabel>
          <FieldContent>
            <Input
              id="postal_code"
              placeholder="Código postal"
              {...register('postal_code')}
            />
            <FieldError errors={[errors.postal_code]} />
          </FieldContent>
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="country">País</FieldLabel>
          <FieldContent>
            <Input
              id="country"
              placeholder="País"
              {...register('country')}
            />
            <FieldError errors={[errors.country]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="tax_id">ID Fiscal</FieldLabel>
          <FieldContent>
            <Input
              id="tax_id"
              placeholder="Número de identificación fiscal"
              {...register('tax_id')}
            />
            <FieldError errors={[errors.tax_id]} />
          </FieldContent>
        </Field>
      </div>

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
        <FieldLabel htmlFor="is_active">Activo</FieldLabel>
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