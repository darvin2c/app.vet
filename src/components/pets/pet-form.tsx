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
import { ClientSelect } from '@/components/clients/client-select'
import { SpeciesSelect } from '@/components/species/species-select'
import { BreedSelect } from '@/components/breeds/breed-select'
import { Tables } from '@/types/supabase.types'

interface PetFormProps {
  mode?: 'create' | 'edit'
  pet?: Tables<'pets'>
}

export function PetForm({ mode = 'create', pet }: PetFormProps) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<CreatePetSchema>()

  return (
    <div className="space-y-6">
      {/* Información básica */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Información básica</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <ClientSelect
                value={watch('client_id') || ''}
                onValueChange={(value) => setValue('client_id', value || '')}
                placeholder="Seleccionar cliente..."
              />
              <FieldError errors={[errors.client_id]} />
            </FieldContent>
          </Field>
        </div>
      </div>

      {/* Clasificación */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Clasificación</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field>
            <FieldLabel htmlFor="species_id">Especie *</FieldLabel>
            <FieldContent>
              <SpeciesSelect
                value={watch('species_id') || ''}
                onValueChange={(value) => {
                  setValue('species_id', value || '')
                  // Limpiar la raza cuando cambia la especie
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
        </div>
      </div>

      {/* Características físicas */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Características físicas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field>
            <FieldLabel htmlFor="birth_date">Fecha de nacimiento</FieldLabel>
            <FieldContent>
              <Input id="birth_date" type="date" {...register('birth_date')} />
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
                  setValueAs: (value) =>
                    value ? parseFloat(value) : undefined,
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
        </div>
      </div>

      {/* Identificación */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Identificación</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      {/* Configuración */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Configuración</h3>

        {/* Fila horizontal para estado activo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <IsActiveFormField />
        </div>

        {/* Fila separada para notas con ancho completo */}
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
      </div>
    </div>
  )
}
