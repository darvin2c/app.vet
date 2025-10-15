'use client'

import { useFormContext } from 'react-hook-form'
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Scissors, Clock, FileText, AlertTriangle } from 'lucide-react'

export function SurgeryForm() {
  const { register, formState: { errors } } = useFormContext()

  return (
    <div className="space-y-6 border-t pt-6">
      <div className="flex items-center gap-2 mb-4">
        <Scissors className="h-5 w-5 text-red-600" />
        <h3 className="text-lg font-semibold">Información de Cirugía</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="duration_min">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Duración (minutos)
            </div>
          </FieldLabel>
          <FieldContent>
            <Input
              id="duration_min"
              type="number"
              min="1"
              placeholder="Ej: 45"
              {...register('duration_min', { valueAsNumber: true })}
            />
            <FieldError errors={[errors.duration_min]} />
          </FieldContent>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="surgeon_notes">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Notas del Cirujano
          </div>
        </FieldLabel>
        <FieldContent>
          <Textarea
            id="surgeon_notes"
            placeholder="Detalles del procedimiento, técnica utilizada, observaciones..."
            rows={4}
            {...register('surgeon_notes')}
          />
          <FieldError errors={[errors.surgeon_notes]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="complications">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Complicaciones
          </div>
        </FieldLabel>
        <FieldContent>
          <Textarea
            id="complications"
            placeholder="Registre cualquier complicación durante o después del procedimiento..."
            rows={3}
            {...register('complications')}
          />
          <FieldError errors={[errors.complications]} />
        </FieldContent>
      </Field>
    </div>
  )
}