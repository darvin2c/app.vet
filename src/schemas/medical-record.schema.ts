import { z } from 'zod'

export const MedicalRecordSchema = z.object({
  pet_id: z.string().nonempty('La mascota es requerida'),
  record_type: z
    .enum([
      'consultation',
      'vaccination',
      'surgery',
      'hospitalization',
      'deworming',
    ])
    .refine((val) => val !== undefined, {
      message: 'El tipo de registro médico es requerido',
    }),
  record_date: z.string().nonempty('La fecha del registro es requerida'),
  reason: z.string().optional(),
  diagnosis: z.string().optional(),
  vet_id: z.string().optional(),
  appointment_id: z.string().optional(),
  notes: z.string().optional(),
})

export type MedicalRecordFormData = z.infer<typeof MedicalRecordSchema>
