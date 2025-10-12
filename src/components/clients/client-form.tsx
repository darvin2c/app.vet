'use client'

import { useFormContext } from 'react-hook-form'
import { useEffect } from 'react'
import { CreateClientSchema } from '@/schemas/clients.schema'
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'


export function ClientForm() {
  const { register, formState: { errors }, watch } = useFormContext<CreateClientSchema>()
  
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
            <FieldLabel htmlFor="full_name">Nombre Completo *</FieldLabel>
            <FieldContent>
              <Input
                id="full_name"
                type="text"
                {...register('full_name')}
              />
              <FieldError errors={[errors.full_name]} />
            </FieldContent>
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="document_number">Número de Documento</FieldLabel>
          <FieldContent>
            <Input
              id="document_number"
              type="text"
              placeholder="Ingresa el número de documento"
              {...register('document_number')}
            />
            <FieldError errors={[errors.document_number]} />
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


      </div>
    </div>
  )
}