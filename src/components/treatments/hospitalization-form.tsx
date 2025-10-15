'use client'

import { useFormContext } from 'react-hook-form'
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Building, Calendar, Bed, DollarSign, FileText } from 'lucide-react'

export function HospitalizationForm() {
  const { register, formState: { errors } } = useFormContext()

  return (
    <div className="space-y-6 border-t pt-6">
      <div className="flex items-center gap-2 mb-4">
        <Building className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg font-semibold">Información de Hospitalización</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="admission_at">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Fecha de Admisión *
            </div>
          </FieldLabel>
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
          <FieldLabel htmlFor="discharge_at">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Fecha de Alta
            </div>
          </FieldLabel>
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
          <FieldLabel htmlFor="bed_id">
            <div className="flex items-center gap-2">
              <Bed className="h-4 w-4" />
              Cama/Habitación
            </div>
          </FieldLabel>
          <FieldContent>
            <Input
              id="bed_id"
              placeholder="Ej: Cama 1, Habitación A"
              {...register('bed_id')}
            />
            <FieldError errors={[errors.bed_id]} />
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
        <FieldLabel htmlFor="notes">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Notas de Hospitalización
          </div>
        </FieldLabel>
        <FieldContent>
          <Textarea
            id="notes"
            placeholder="Motivo de hospitalización, cuidados especiales, observaciones..."
            rows={4}
            {...register('notes')}
          />
          <FieldError errors={[errors.notes]} />
        </FieldContent>
      </Field>
    </div>
  )
}