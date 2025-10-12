'use client'

import { useFormContext } from 'react-hook-form'
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { ClientSelect } from '@/components/clients/client-select'
import { CreatePetSchema } from '@/schemas/pets.schema'

export function PetForm() {
  const { register, formState: { errors }, setValue, watch } = useFormContext<CreatePetSchema>()
  


  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel htmlFor="name">Nombre *</FieldLabel>
        <FieldContent>
          <Input
            id="name"
            placeholder="Nombre de la mascota"
            {...register('name')}
          />
          <FieldError errors={[errors.name]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="client_id">Cliente *</FieldLabel>
        <FieldContent>
          <ClientSelect
            value={watch('client_id')}
            onValueChange={(value) => setValue('client_id', value)}
          />
          <FieldError errors={[errors.client_id]} />
        </FieldContent>
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="species_id">Especie *</FieldLabel>
          <FieldContent>
            <Input
              id="species_id"
              placeholder="ID de la especie"
              {...register('species_id')}
            />
            <FieldError errors={[errors.species_id]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="breed_id">Raza</FieldLabel>
          <FieldContent>
            <Input
              id="breed_id"
              placeholder="ID de la raza"
              {...register('breed_id')}
            />
            <FieldError errors={[errors.breed_id]} />
          </FieldContent>
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="sex">Género</FieldLabel>
          <FieldContent>
            <Select
              value={watch('sex')}
              onValueChange={(value) => setValue('sex', value as 'M' | 'F')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar género" />
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="birth_date">Fecha de Nacimiento</FieldLabel>
          <FieldContent>
            <Input
              id="birth_date"
              type="date"
              {...register('birth_date')}
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
              placeholder="0.0"
              {...register('weight', { valueAsNumber: true })}
            />
            <FieldError errors={[errors.weight]} />
          </FieldContent>
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <FieldLabel htmlFor="microchip">Número de Microchip</FieldLabel>
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
            placeholder="Notas adicionales sobre la mascota"
            {...register('notes')}
          />
          <FieldError errors={[errors.notes]} />
        </FieldContent>
      </Field>
    </div>
  )
}