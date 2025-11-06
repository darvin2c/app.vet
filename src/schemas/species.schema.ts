import { z } from 'zod'

// Esquema base para especie - basado en la tabla species de Supabase
export const speciesBaseSchema = z.object({
  name: z
    .string()
    .nonempty('El nombre de la especie es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  description: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional()
    .or(z.literal('')),
  is_active: z.boolean(),
})

// Esquema para crear especie
export const speciesCreateSchema = speciesBaseSchema
export const speciesUpdateSchema = speciesBaseSchema
export const speciesImportSchema = speciesBaseSchema.extend({
  is_active: z.coerce.boolean(),
})

// Tipos derivados
export type SpeciesCreate = z.infer<typeof speciesCreateSchema>
export type SpeciesUpdate = z.infer<typeof speciesUpdateSchema>
