import { z } from 'zod'

export const DewormingSchema = z.object({
  treatment_id: z.string().nonempty('El tratamiento es requerido'),
  parasite_type: z.string().optional(),
  medication: z.string().optional(),
  dosage: z.string().optional(),
  administration_route: z.string().optional(),
  next_dose_date: z.string().optional(),
  weight_at_treatment: z
    .number()
    .min(0, 'El peso debe ser mayor a 0')
    .optional(),
  treatment_notes: z.string().optional(),
})

export type DewormingFormData = z.infer<typeof DewormingSchema>
