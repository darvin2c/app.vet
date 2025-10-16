import { z } from 'zod'

export const BoardingSchema = z.object({
  check_in_at: z.string().nonempty('La fecha de ingreso es requerida'),
  check_out_at: z.string().optional().or(z.literal('')),
  daily_rate: z
    .number()
    .min(0, 'La tarifa diaria debe ser mayor o igual a 0')
    .optional(),
  feeding_notes: z.string().optional().or(z.literal('')),
  kennel_id: z.string().optional().or(z.literal('')),
  observations: z.string().optional().or(z.literal('')),
  treatment_id: z.string().nonempty('El registro médico es requerido'),
})

export type BoardingFormData = z.infer<typeof BoardingSchema>
