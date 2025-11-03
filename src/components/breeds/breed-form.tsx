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
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BreedCreate } from '@/schemas/breeds.schema'
import { useSpeciesList } from '@/hooks/species/use-species-list'

interface BreedFormProps {
  selectedSpeciesId?: string
}

export function BreedForm({ selectedSpeciesId }: BreedFormProps) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<BreedCreate>()

  const isActive = watch('is_active')
  const speciesId = watch('species_id')

  // Obtener lista de especies activas
  const { data: species = [] } = useSpeciesList({
    filters: [{ key: 'is_active', field: 'is_active', operator: 'eq', value: true, type: 'boolean' }],
  })

  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel htmlFor="species_id">Especie</FieldLabel>
        <FieldContent>
          <Select
            value={speciesId || selectedSpeciesId}
            onValueChange={(value) => setValue('species_id', value)}
            disabled={!!selectedSpeciesId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una especie" />
            </SelectTrigger>
            <SelectContent>
              {species.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError errors={[errors.species_id]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="name">Nombre de la Raza</FieldLabel>
        <FieldContent>
          <Input
            id="name"
            placeholder="Ej: Labrador, Siamés, Canario..."
            {...register('name')}
          />
          <FieldError errors={[errors.name]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="description">Descripción</FieldLabel>
        <FieldContent>
          <Textarea
            id="description"
            placeholder="Descripción opcional de la raza..."
            rows={3}
            {...register('description')}
          />
          <FieldError errors={[errors.description]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_active"
              checked={isActive}
              onCheckedChange={(checked) => setValue('is_active', !!checked)}
            />
            <FieldLabel htmlFor="is_active" className="text-sm font-normal">
              Raza activa
            </FieldLabel>
          </div>
          <FieldError errors={[errors.is_active]} />
        </FieldContent>
      </Field>
    </div>
  )
}
