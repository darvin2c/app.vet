import { z } from 'zod'

export const HospitalizationSchema = z.object({
  admission_at: z.string().nonempty('La fecha de admisión es requerida'),
  bed_id: z.string().optional().or(z.literal('')),
  daily_rate: z
    .number()
    .min(0, 'La tarifa diaria debe ser mayor o igual a 0')
    .optional(),
  discharge_at: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
  treatment_id: z.string().nonempty('El tratamiento es requerido'),
})

export type HospitalizationFormData = z.infer<typeof HospitalizationSchema>
