'use client'

import { useFormContext } from 'react-hook-form'
import { Building2 } from 'lucide-react'
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function HospitalizationForm() {
  const { register, formState: { errors } } = useFormContext()

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Building2 className="h-4 w-4" />
        Detalles de Hospitalización
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="admission_at">Fecha de Ingreso</FieldLabel>
          <FieldContent>
            <Input
              id="admission_at"
              type="datetime-local"
              {...register('admission_at')}
            />
            <FieldError errors={[errors.admission_at]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="discharge_at">Fecha de Alta</FieldLabel>
          <FieldContent>
            <Input
              id="discharge_at"
              type="datetime-local"
              {...register('discharge_at')}
            />
            <FieldError errors={[errors.discharge_at]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="bed_id">ID de Cama</FieldLabel>
          <FieldContent>
            <Input
              id="bed_id"
              placeholder="Identificador de la cama asignada"
              {...register('bed_id')}
            />
            <FieldError errors={[errors.bed_id]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="daily_rate">Tarifa Diaria</FieldLabel>
          <FieldContent>
            <Input
              id="daily_rate"
              type="number"
              step="0.01"
              placeholder="Ej: 150.00"
              {...register('daily_rate', { valueAsNumber: true })}
            />
            <FieldError errors={[errors.daily_rate]} />
          </FieldContent>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="notes">Notas de Hospitalización</FieldLabel>
        <FieldContent>
          <Textarea
            id="notes"
            placeholder="Observaciones durante la hospitalización, cuidados especiales, etc..."
            rows={4}
            {...register('notes')}
          />
          <FieldError errors={[errors.notes]} />
        </FieldContent>
      </Field>
    </div>
  )
}