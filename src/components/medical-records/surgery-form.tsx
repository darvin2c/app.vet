'use client'

import { useFormContext } from 'react-hook-form'
import { Scissors } from 'lucide-react'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function SurgeryForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Scissors className="h-4 w-4" />
        Detalles de Cirugía
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="duration_min">Duración (minutos)</FieldLabel>
          <FieldContent>
            <Input
              id="duration_min"
              type="number"
              placeholder="Ej: 120"
              {...register('duration_min', { valueAsNumber: true })}
            />
            <FieldError errors={[errors.duration_min]} />
          </FieldContent>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="surgeon_notes">Notas del Cirujano</FieldLabel>
        <FieldContent>
          <Textarea
            id="surgeon_notes"
            placeholder="Describe el procedimiento quirúrgico realizado..."
            rows={4}
            {...register('surgeon_notes')}
          />
          <FieldError errors={[errors.surgeon_notes]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="complications">Complicaciones</FieldLabel>
        <FieldContent>
          <Textarea
            id="complications"
            placeholder="Describe cualquier complicación durante o después de la cirugía..."
            rows={3}
            {...register('complications')}
          />
          <FieldError errors={[errors.complications]} />
        </FieldContent>
      </Field>
    </div>
  )
}
