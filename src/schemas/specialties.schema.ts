import { z } from 'zod'

// Esquema base para especialidad - basado en la tabla specialties de Supabase
export const specialtyBaseSchema = z.object({
  name: z
    .string()
    .nonempty('El nombre de la especialidad es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  description: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional()
    .or(z.literal('')),
  is_active: z.boolean(),
})

// Esquema para crear especialidad
export const specialtyCreateSchema = specialtyBaseSchema
export const specialtyUpdateSchema = specialtyBaseSchema
export const specialtyImportSchema = specialtyBaseSchema.extend({
  is_active: z.coerce.boolean().default(true),
})

// Tipos derivados
export type SpecialtyCreateSchema = z.infer<typeof specialtyCreateSchema>
export type SpecialtyUpdateSchema = z.infer<typeof specialtyCreateSchema>
