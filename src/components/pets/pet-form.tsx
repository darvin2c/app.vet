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
  
  const isActive = watch('is_active')
  const isSterilized = watch('is_sterilized')

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
          <FieldLabel htmlFor="species">Especie *</FieldLabel>
          <FieldContent>
            <Select
              value={watch('species')}
              onValueChange={(value) => setValue('species', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar especie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dog">Perro</SelectItem>
                <SelectItem value="cat">Gato</SelectItem>
                <SelectItem value="bird">Ave</SelectItem>
                <SelectItem value="rabbit">Conejo</SelectItem>
                <SelectItem value="hamster">Hámster</SelectItem>
                <SelectItem value="fish">Pez</SelectItem>
                <SelectItem value="reptile">Reptil</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
              </SelectContent>
            </Select>
            <FieldError errors={[errors.species]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="gender">Género</FieldLabel>
          <FieldContent>
            <Select
              value={watch('gender')}
              onValueChange={(value) => setValue('gender', value as 'male' | 'female' | 'unknown')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar género" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Macho</SelectItem>
                <SelectItem value="female">Hembra</SelectItem>
                <SelectItem value="unknown">Desconocido</SelectItem>
              </SelectContent>
            </Select>
            <FieldError errors={[errors.gender]} />
          </FieldContent>
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <FieldLabel htmlFor="microchip_number">Número de Microchip</FieldLabel>
          <FieldContent>
            <Input
              id="microchip_number"
              placeholder="Número de microchip"
              {...register('microchip_number')}
            />
            <FieldError errors={[errors.microchip_number]} />
          </FieldContent>
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="is_sterilized">Esterilizado</FieldLabel>
          <FieldContent>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_sterilized"
                checked={isSterilized}
                onCheckedChange={(checked) => setValue('is_sterilized', checked)}
              />
              <span className="text-sm text-muted-foreground">
                {isSterilized ? 'Sí' : 'No'}
              </span>
            </div>
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
      </div>

      <Field>
        <FieldLabel htmlFor="allergies">Alergias</FieldLabel>
        <FieldContent>
          <Textarea
            id="allergies"
            placeholder="Alergias conocidas"
            {...register('allergies')}
          />
          <FieldError errors={[errors.allergies]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="medical_notes">Notas Médicas</FieldLabel>
        <FieldContent>
          <Textarea
            id="medical_notes"
            placeholder="Notas médicas adicionales"
            {...register('medical_notes')}
          />
          <FieldError errors={[errors.medical_notes]} />
        </FieldContent>
      </Field>
    </div>
  )
}