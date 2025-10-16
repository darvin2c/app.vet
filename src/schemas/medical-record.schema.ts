import { z } from 'zod'

export const MedicalRecordSchema = z.object({
  pet_id: z.string().nonempty('La mascota es requerida'),
  type: z
    .enum([
      'consultation',
      'vaccination',
      'surgery',
      'grooming',
      'hospitalization',
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
  date: z.string().nonempty('La fecha del tratamiento es requerida'),
  vet_id: z.string().optional(),
  appointment_id: z.string().optional(),
  notes: z.string().optional(),
})

export type MedicalRecordFormData = z.infer<typeof MedicalRecordSchema>
