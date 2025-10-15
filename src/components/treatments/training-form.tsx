'use client'

import { useFormContext } from 'react-hook-form'
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { GraduationCap, Target, Hash, User, FileText } from 'lucide-react'

export function TrainingForm() {
  const { register, formState: { errors } } = useFormContext()

  return (
    <div className="space-y-6 border-t pt-6">
      <div className="flex items-center gap-2 mb-4">
        <GraduationCap className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Información de Entrenamiento</h3>
      </div>

      <Field>
        <FieldLabel htmlFor="goal">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Objetivo del Entrenamiento
          </div>
        </FieldLabel>
        <FieldContent>
          <Input
            id="goal"
            placeholder="Ej: Obediencia básica, Control de ladridos"
            {...register('goal')}
          />
          <FieldError errors={[errors.goal]} />
        </FieldContent>
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field>
          <FieldLabel htmlFor="sessions_planned">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Sesiones Planeadas
            </div>
          </FieldLabel>
          <FieldContent>
            <Input
              id="sessions_planned"
              type="number"
              min="1"
              placeholder="Ej: 10"
              {...register('sessions_planned', { valueAsNumber: true })}
            />
            <FieldError errors={[errors.sessions_planned]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="sessions_completed">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Sesiones Completadas
            </div>
          </FieldLabel>
          <FieldContent>
            <Input
              id="sessions_completed"
              type="number"
              min="0"
              placeholder="Ej: 3"
              {...register('sessions_completed', { valueAsNumber: true })}
            />
            <FieldError errors={[errors.sessions_completed]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="trainer_id">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              ID del Entrenador
            </div>
          </FieldLabel>
          <FieldContent>
            <Input
              id="trainer_id"
              placeholder="ID del entrenador"
              {...register('trainer_id')}
            />
            <FieldError errors={[errors.trainer_id]} />
          </FieldContent>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="progress_notes">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Notas de Progreso
          </div>
        </FieldLabel>
        <FieldContent>
          <Textarea
            id="progress_notes"
            placeholder="Registre el progreso del entrenamiento, comportamientos observados, recomendaciones..."
            rows={4}
            {...register('progress_notes')}
          />
          <FieldError errors={[errors.progress_notes]} />
        </FieldContent>
      </Field>
    </div>
  )
}