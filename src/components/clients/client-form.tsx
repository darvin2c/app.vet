'use client'

import { useFormContext } from 'react-hook-form'
import { useEffect } from 'react'
import { CreateClientSchema } from '@/schemas/clients.schema'
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'

export function ClientForm() {
  const { register, formState: { errors }, watch, setValue } = useFormContext<CreateClientSchema>()
  
  // Watcher para validar campos relacionados
  const email = watch('email')
  const phone = watch('phone')
  
  useEffect(() => {
    // Validación adicional si es necesaria
    if (email && phone) {
      // Lógica adicional si se requiere
    }
  }, [email, phone])

  return (
    <div className="space-y-6">
      {/* Información Personal */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Información Personal</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="first_name">Nombre *</FieldLabel>
            <FieldContent>
              <Input
                id="first_name"
                placeholder="Ingrese el nombre"
                {...register('first_name')}
              />
              <FieldError errors={[errors.first_name]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="last_name">Apellido *</FieldLabel>
            <FieldContent>
              <Input
                id="last_name"
                placeholder="Ingrese el apellido"
                {...register('last_name')}
              />
              <FieldError errors={[errors.last_name]} />
            </FieldContent>
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="date_of_birth">Fecha de Nacimiento</FieldLabel>
          <FieldContent>
            <Input
              id="date_of_birth"
              type="date"
              {...register('date_of_birth')}
            />
            <FieldError errors={[errors.date_of_birth]} />
          </FieldContent>
        </Field>
      </div>

      {/* Información de Contacto */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Información de Contacto</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <FieldContent>
              <Input
                id="email"
                type="email"
                placeholder="ejemplo@correo.com"
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
                placeholder="+51 999 999 999"
                {...register('phone')}
              />
              <FieldError errors={[errors.phone]} />
            </FieldContent>
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="address">Dirección</FieldLabel>
          <FieldContent>
            <Textarea
              id="address"
              placeholder="Ingrese la dirección completa"
              rows={3}
              {...register('address')}
            />
            <FieldError errors={[errors.address]} />
          </FieldContent>
        </Field>
      </div>

      {/* Contacto de Emergencia */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Contacto de Emergencia</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="emergency_contact_name">Nombre del Contacto</FieldLabel>
            <FieldContent>
              <Input
                id="emergency_contact_name"
                placeholder="Nombre completo"
                {...register('emergency_contact_name')}
              />
              <FieldError errors={[errors.emergency_contact_name]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="emergency_contact_phone">Teléfono del Contacto</FieldLabel>
            <FieldContent>
              <Input
                id="emergency_contact_phone"
                placeholder="+51 999 999 999"
                {...register('emergency_contact_phone')}
              />
              <FieldError errors={[errors.emergency_contact_phone]} />
            </FieldContent>
          </Field>
        </div>
      </div>

      {/* Notas Adicionales */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Información Adicional</h3>
        
        <Field>
          <FieldLabel htmlFor="notes">Notas</FieldLabel>
          <FieldContent>
            <Textarea
              id="notes"
              placeholder="Notas adicionales sobre el cliente..."
              rows={4}
              {...register('notes')}
            />
            <FieldError errors={[errors.notes]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldContent>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                {...register('is_active')}
                onCheckedChange={(checked) => setValue('is_active', !!checked)}
              />
              <FieldLabel htmlFor="is_active" className="text-sm font-normal">
                Cliente activo
              </FieldLabel>
            </div>
            <FieldError errors={[errors.is_active]} />
          </FieldContent>
        </Field>
      </div>
    </div>
  )
}