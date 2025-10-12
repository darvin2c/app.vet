import { z } from 'zod'

export const TreatmentSchema = z.object({
  id: z.string().uuid().optional(),
  client_id: z.string().uuid(),
  procedure_id: z.string().uuid(),
  staff_id: z.string().uuid(),
  date: z.date(),
  status: z.enum(['planned', 'in_progress', 'completed', 'cancelled']),
  notes: z.string().optional(),
  cost: z.number().min(0).optional(),
  duration_minutes: z.number().min(1).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
})

export const CreateTreatmentSchema = TreatmentSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
})

export const UpdateTreatmentSchema = TreatmentSchema.partial().required({
  id: true,
})

export type Treatment = z.infer<typeof TreatmentSchema>
export type CreateTreatment = z.infer<typeof CreateTreatmentSchema>
export type UpdateTreatment = z.infer<typeof UpdateTreatmentSchema>

// Schema para filtros de tratamientos
export const TreatmentFiltersSchema = z.object({
  status: z
    .enum(['planned', 'in_progress', 'completed', 'cancelled'])
    .optional(),
  date_from: z.date().optional(),
  date_to: z.date().optional(),
  procedure_id: z.string().uuid().optional(),
  staff_id: z.string().uuid().optional(),
})

export type TreatmentFilters = z.infer<typeof TreatmentFiltersSchema>
