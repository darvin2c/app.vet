import { z } from 'zod'

export const SurgerySchema = z.object({
  treatment_id: z.string().nonempty('El campo es requerido'),
  duration_min: z.number().min(1, 'La duración debe ser mayor a 0').optional(),
  surgeon_notes: z.string().optional(),
  complications: z.string().optional(),
})

export type SurgeryFormData = z.infer<typeof SurgerySchema>
