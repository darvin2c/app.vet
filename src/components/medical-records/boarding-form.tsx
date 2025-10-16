'use client'

import { useFormContext } from 'react-hook-form'
import { Home } from 'lucide-react'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function BoardingForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Home className="h-4 w-4" />
        Detalles de Hospedaje
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="check_in_at">Fecha de Ingreso</FieldLabel>
          <FieldContent>
            <Input
              id="check_in_at"
              type="datetime-local"
              {...register('check_in_at')}
            />
            <FieldError errors={[errors.check_in_at]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="check_out_at">Fecha de Salida</FieldLabel>
          <FieldContent>
            <Input
              id="check_out_at"
              type="datetime-local"
              {...register('check_out_at')}
            />
            <FieldError errors={[errors.check_out_at]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="kennel_id">ID de Kennel</FieldLabel>
          <FieldContent>
            <Input
              id="kennel_id"
              placeholder="Identificador del kennel asignado"
              {...register('kennel_id')}
            />
            <FieldError errors={[errors.kennel_id]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="daily_rate">Tarifa Diaria</FieldLabel>
          <FieldContent>
            <Input
              id="daily_rate"
              type="number"
              step="0.01"
              placeholder="Ej: 80.00"
              {...register('daily_rate', { valueAsNumber: true })}
            />
            <FieldError errors={[errors.daily_rate]} />
          </FieldContent>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="feeding_notes">Notas de Alimentación</FieldLabel>
        <FieldContent>
          <Textarea
            id="feeding_notes"
            placeholder="Instrucciones especiales de alimentación, horarios, dieta, etc..."
            rows={3}
            {...register('feeding_notes')}
          />
          <FieldError errors={[errors.feeding_notes]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="observations">Observaciones</FieldLabel>
        <FieldContent>
          <Textarea
            id="observations"
            placeholder="Comportamiento, necesidades especiales, medicamentos, etc..."
            rows={3}
            {...register('observations')}
          />
          <FieldError errors={[errors.observations]} />
        </FieldContent>
      </Field>
    </div>
  )
}
