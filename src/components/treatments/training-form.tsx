'use client'

import { useFormContext } from 'react-hook-form'
import { GraduationCap } from 'lucide-react'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function TrainingForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <GraduationCap className="h-4 w-4" />
        Detalles de Entrenamiento
      </div>

      <Field>
        <FieldLabel htmlFor="goal">Objetivo del Entrenamiento</FieldLabel>
        <FieldContent>
          <Textarea
            id="goal"
            placeholder="Describe el objetivo principal del entrenamiento..."
            rows={2}
            {...register('goal')}
          />
          <FieldError errors={[errors.goal]} />
        </FieldContent>
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field>
          <FieldLabel htmlFor="sessions_planned">
            Sesiones Planificadas
          </FieldLabel>
          <FieldContent>
            <Input
              id="sessions_planned"
              type="number"
              placeholder="Ej: 10"
              {...register('sessions_planned', { valueAsNumber: true })}
            />
            <FieldError errors={[errors.sessions_planned]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="sessions_completed">
            Sesiones Completadas
          </FieldLabel>
          <FieldContent>
            <Input
              id="sessions_completed"
              type="number"
              placeholder="Ej: 3"
              {...register('sessions_completed', { valueAsNumber: true })}
            />
            <FieldError errors={[errors.sessions_completed]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="trainer_id">ID del Entrenador</FieldLabel>
          <FieldContent>
            <Input
              id="trainer_id"
              placeholder="ID del entrenador asignado"
              {...register('trainer_id')}
            />
            <FieldError errors={[errors.trainer_id]} />
          </FieldContent>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="progress_notes">Notas de Progreso</FieldLabel>
        <FieldContent>
          <Textarea
            id="progress_notes"
            placeholder="Describe el progreso del entrenamiento, comportamientos observados, etc..."
            rows={4}
            {...register('progress_notes')}
          />
          <FieldError errors={[errors.progress_notes]} />
        </FieldContent>
      </Field>
    </div>
  )
}
