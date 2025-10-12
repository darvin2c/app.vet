'use client'

import { useFormContext } from 'react-hook-form'
import { CreatePatientSchema } from '@/schemas/patients.schema'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { AddressInput } from '@/components/ui/address-input'
import { IsActiveFormField } from '@/components/ui/is-active-field'
import { PhoneField } from '@/components/ui/phone-input'
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldError,
} from '@/components/ui/field'
import { PatientSexOptions } from '@/schemas/patients.schema'

export function PatientForm() {
  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<CreatePatientSchema>()

  const address = watch('address')

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="first_name">Nombre *</FieldLabel>
          <FieldContent>
            <Input
              id="first_name"
              placeholder="Ingrese el nombre"
              {...control.register('first_name')}
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
              {...control.register('last_name')}
            />
            <FieldError errors={[errors.last_name]} />
          </FieldContent>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <FieldContent>
            <Input
              id="email"
              type="email"
              placeholder="ejemplo@correo.com"
              {...control.register('email')}
            />
            <FieldError errors={[errors.email]} />
          </FieldContent>
        </Field>

        <PhoneField
          name="phone"
          label="Teléfono"
          placeholder="Ingrese el número de teléfono"
          defaultCountry="PE"
          showCountrySelect={true}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="date_of_birth">Fecha de Nacimiento</FieldLabel>
          <FieldContent>
            <Input
              id="date_of_birth"
              type="date"
              {...control.register('date_of_birth')}
            />
            <FieldError errors={[errors.date_of_birth]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="sex">Sexo</FieldLabel>
          <FieldContent>
            <Select {...control.register('sex')}>
              <SelectTrigger id="sex">
                <SelectValue placeholder="Seleccione el sexo" />
              </SelectTrigger>
              <SelectContent>
                {PatientSexOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={[errors.sex]} />
          </FieldContent>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="address">Dirección</FieldLabel>
        <FieldContent>
          <AddressInput
            value={address || ''}
            onChange={(value) => setValue('address', value)}
            placeholder="Ingrese la dirección completa"
            onAddressSelect={(addressData) => {
              setValue('address', addressData.formatted_address)
            }}
          />
          <FieldError errors={[errors.address]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="allergies">Alergias</FieldLabel>
        <FieldContent>
          <Textarea
            id="allergies"
            placeholder="Describa las alergias conocidas"
            className="resize-none"
            {...control.register('allergies')}
          />
          <FieldError errors={[errors.allergies]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="systemic_diseases">
          Enfermedades Sistémicas
        </FieldLabel>
        <FieldContent>
          <Textarea
            id="systemic_diseases"
            placeholder="Describa las enfermedades sistémicas"
            className="resize-none"
            {...control.register('systemic_diseases')}
          />
          <FieldError errors={[errors.systemic_diseases]} />
        </FieldContent>
      </Field>

      <IsActiveFormField
        name="is_active"
        label="Estado del Paciente"
        description="Determina si el paciente está activo en el sistema"
        activeText="Activo"
        inactiveText="Inactivo"
      />
    </div>
  )
}
