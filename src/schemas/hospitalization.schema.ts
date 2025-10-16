import { z } from 'zod'

// Schema para hospitalization basado en la tabla hospitalizations de Supabase + pet_id
export const hospitalizationSchema = z.object({
  pet_id: z.string().nonempty('El ID de la mascota es requerido'),
  admission_at: z.string().nonempty('La fecha de ingreso es requerida'),
  discharge_at: z.string().optional().or(z.literal('')),
  bed_id: z.string().optional().or(z.literal('')),
  daily_rate: z.number().min(0, 'La tarifa diaria debe ser mayor o igual a 0').optional(),
  notes: z.string().optional().or(z.literal('')),
})

export type HospitalizationSchema = z.infer<typeof hospitalizationSchema>

// Schema para crear hospitalization (omite campos auto-generados)
export const hospitalizationCreateSchema = hospitalizationSchema

// Schema para actualizar hospitalization (todos los campos opcionales excepto pet_id)
export const hospitalizationUpdateSchema = hospitalizationSchema.partial().extend({
  pet_id: z.string().nonempty('El ID de la mascota es requerido'),
})

export type HospitalizationCreateSchema = z.infer<typeof hospitalizationCreateSchema>
export type HospitalizationUpdateSchema = z.infer<typeof hospitalizationUpdateSchema>