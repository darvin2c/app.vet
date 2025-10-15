'use client'

import { useFormContext } from 'react-hook-form'
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Home, Calendar, DollarSign, Utensils, FileText } from 'lucide-react'

export function BoardingForm() {
  const { register, formState: { errors } } = useFormContext()

  return (
    <div className="space-y-6 border-t pt-6">
      <div className="flex items-center gap-2 mb-4">
        <Home className="h-5 w-5 text-orange-600" />
        <h3 className="text-lg font-semibold">Información de Hospedaje</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="check_in_at">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Fecha de Ingreso *
            </div>
          </FieldLabel>
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
          <FieldLabel htmlFor="check_out_at">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Fecha de Salida
            </div>
          </FieldLabel>
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
          <FieldLabel htmlFor="kennel_id">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Kennel/Habitación
            </div>
          </FieldLabel>
          <FieldContent>
            <Input
              id="kennel_id"
              placeholder="Ej: Kennel 5, Habitación B"
              {...register('kennel_id')}
            />
            <FieldError errors={[errors.kennel_id]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="daily_rate">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Tarifa Diaria
            </div>
          </FieldLabel>
          <FieldContent>
            <Input
              id="daily_rate"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              {...register('daily_rate', { valueAsNumber: true })}
            />
            <FieldError errors={[errors.daily_rate]} />
          </FieldContent>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="feeding_notes">
          <div className="flex items-center gap-2">
            <Utensils className="h-4 w-4" />
            Notas de Alimentación
          </div>
        </FieldLabel>
        <FieldContent>
          <Textarea
            id="feeding_notes"
            placeholder="Horarios de comida, tipo de alimento, restricciones dietéticas..."
            rows={3}
            {...register('feeding_notes')}
          />
          <FieldError errors={[errors.feeding_notes]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="observations">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Observaciones Generales
          </div>
        </FieldLabel>
        <FieldContent>
          <Textarea
            id="observations"
            placeholder="Comportamiento, necesidades especiales, medicamentos..."
            rows={3}
            {...register('observations')}
          />
          <FieldError errors={[errors.observations]} />
        </FieldContent>
      </Field>
    </div>
  )
}