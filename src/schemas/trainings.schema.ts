import { z } from 'zod'

export const TrainingSchema = z.object({
  treatment_id: z.string().nonempty('El tratamiento es requerido'),
  goal: z.string().optional(),
  sessions_planned: z.number().min(1, 'Debe ser mayor a 0').optional(),
  sessions_completed: z
    .number()
    .min(0, 'Debe ser mayor o igual a 0')
    .optional(),
  trainer_id: z.string().optional(),
  progress_notes: z.string().optional(),
})

export type TrainingFormData = z.infer<typeof TrainingSchema>
