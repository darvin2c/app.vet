import { z } from 'zod'

export const TreatmentSchema = z.object({
  pet_id: z.string().nonempty('La mascota es requerida'),
  treatment_type: z
    .enum([
      'consultation',
      'vaccination',
      'surgery',
      'grooming',
      'deworming',
      'boarding',
      'training',
    ])
    .refine((val) => val !== undefined, {
      message: 'El tipo de tratamiento es requerido',
    }),
  status: z
    .enum(['draft', 'completed', 'cancelled'])
    .refine((val) => val !== undefined, {
      message: 'El estado es requerido',
    }),
  treatment_date: z.string().nonempty('La fecha de tratamiento es requerida'),
  vet_id: z.string().optional(),
  appointment_id: z.string().optional(),
})

export type TreatmentFormData = z.infer<typeof TreatmentSchema>
