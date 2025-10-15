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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TrainingFormData } from '@/schemas/trainings.schema'

export function TrainingForm() {
  // context
  const form = useFormContext<TrainingFormData>()

  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel htmlFor="treatment_id">ID del Tratamiento</FieldLabel>
        <FieldContent>
          <Input
            id="treatment_id"
            {...form.register('treatment_id')}
            placeholder="ID del tratamiento asociado"
          />
          <FieldError errors={[form.formState.errors.treatment_id]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="goal">Objetivo</FieldLabel>
        <FieldContent>
          <Input
            id="goal"
            {...form.register('goal')}
            placeholder="Objetivo del entrenamiento"
          />
          <FieldError errors={[form.formState.errors.goal]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="sessions_planned">
          Sesiones Planificadas
        </FieldLabel>
        <FieldContent>
          <Input
            id="sessions_planned"
            type="number"
            min="1"
            {...form.register('sessions_planned', { valueAsNumber: true })}
          />
          <FieldError errors={[form.formState.errors.sessions_planned]} />
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
            min="0"
            {...form.register('sessions_completed', { valueAsNumber: true })}
          />
          <FieldError errors={[form.formState.errors.sessions_completed]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="trainer_id">ID del Entrenador</FieldLabel>
        <FieldContent>
          <Input
            id="trainer_id"
            {...form.register('trainer_id')}
            placeholder="ID del entrenador asignado"
          />
          <FieldError errors={[form.formState.errors.trainer_id]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="progress_notes">Notas de Progreso</FieldLabel>
        <FieldContent>
          <Textarea
            id="progress_notes"
            {...form.register('progress_notes')}
            placeholder="Progreso del entrenamiento..."
          />
          <FieldError errors={[form.formState.errors.progress_notes]} />
        </FieldContent>
      </Field>
    </div>
  )
}
