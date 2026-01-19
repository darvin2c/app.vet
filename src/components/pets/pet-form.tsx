'use client'

import { useFormContext } from 'react-hook-form'
import { CreatePetSchema } from '@/schemas/pets.schema'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import { IsActiveFormField } from '@/components/ui/is-active-field'
import { CustomerSelect } from '@/components/customers/customer-select'
import { SpeciesSelect } from '@/components/species/species-select'
import { BreedSelect } from '@/components/breeds/breed-select'
import { DatePicker } from '@/components/ui/date-picker'

interface PetFormProps {
  mode?: 'create' | 'edit'
}

export function PetForm({ mode = 'create' }: PetFormProps) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<CreatePetSchema>()

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic Info */}
        <Field>
          <FieldLabel htmlFor="name">Nombre *</FieldLabel>
          <FieldContent>
            <Input
              id="name"
              placeholder="Ingresa el nombre de la mascota"
              {...register('name')}
            />
            <FieldError errors={[errors.name]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="client_id">Cliente *</FieldLabel>
          <FieldContent>
            <CustomerSelect
              value={watch('client_id') || ''}
              onValueChange={(value) => setValue('client_id', value || '')}
              placeholder="Seleccionar cliente..."
            />
            <FieldError errors={[errors.client_id]} />
          </FieldContent>
        </Field>

        {/* Classification */}
        <Field>
          <FieldLabel htmlFor="species_id">Especie *</FieldLabel>
          <FieldContent>
            <SpeciesSelect
              value={watch('species_id') || ''}
              onValueChange={(value) => {
                setValue('species_id', value || '')
                setValue('breed_id', '')
              }}
              placeholder="Seleccionar especie..."
            />
            <FieldError errors={[errors.species_id]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="breed_id">Raza</FieldLabel>
          <FieldContent>
            <BreedSelect
              value={watch('breed_id') || ''}
              onValueChange={(value) => setValue('breed_id', value || '')}
              speciesId={watch('species_id')}
              placeholder="Seleccionar raza..."
              disabled={!watch('species_id')}
            />
            <FieldError errors={[errors.breed_id]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="sex">Sexo</FieldLabel>
          <FieldContent>
            <Select
              value={watch('sex') || ''}
              onValueChange={(value) => setValue('sex', value as 'M' | 'F')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar sexo..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Macho</SelectItem>
                <SelectItem value="F">Hembra</SelectItem>
              </SelectContent>
            </Select>
            <FieldError errors={[errors.sex]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="birth_date">Fecha de nacimiento</FieldLabel>
          <FieldContent>
            <DatePicker
              id="birth_date"
              name="birth_date"
              value={watch('birth_date')}
              onChange={(value) => setValue('birth_date', value?.toISOString())}
              error={!!errors.birth_date}
            />
            <FieldError errors={[errors.birth_date]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="weight">Peso (kg)</FieldLabel>
          <FieldContent>
            <Input
              id="weight"
              type="number"
              step="0.1"
              min="0"
              placeholder="0.0"
              {...register('weight', {
                setValueAs: (value) => (value ? parseFloat(value) : undefined),
              })}
            />
            <FieldError errors={[errors.weight]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="color">Color</FieldLabel>
          <FieldContent>
            <Input
              id="color"
              placeholder="Color de la mascota"
              {...register('color')}
            />
            <FieldError errors={[errors.color]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="microchip">Microchip</FieldLabel>
          <FieldContent>
            <Input
              id="microchip"
              placeholder="Número de microchip"
              {...register('microchip')}
            />
            <FieldError errors={[errors.microchip]} />
          </FieldContent>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="notes">Notas</FieldLabel>
        <FieldContent>
          <Textarea
            id="notes"
            placeholder="Notas adicionales sobre la mascota..."
            className="min-h-[100px]"
            {...register('notes')}
          />
          <FieldError errors={[errors.notes]} />
        </FieldContent>
      </Field>

      <IsActiveFormField />
    </div>
  )
}
