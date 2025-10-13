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
  is_active: z.boolean().default(true),
})

// Esquema para crear especie
export const speciesCreateSchema = z.object({
  name: z
    .string()
    .nonempty('El nombre de la especie es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  description: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional()
    .or(z.literal('')),
  is_active: z.boolean().optional().default(true),
})

// Esquema para actualizar especie
export const speciesUpdateSchema = speciesBaseSchema.partial().extend({
  is_active: z.boolean().optional(),
})

// Esquema para filtros de especies
export const speciesFiltersSchema = z.object({
  search: z.string().optional(),
  is_active: z.boolean().optional(),
})

// Tipos derivados
export type SpeciesCreate = z.infer<typeof speciesCreateSchema>
export type SpeciesUpdate = z.infer<typeof speciesUpdateSchema>
export type SpeciesFilters = z.infer<typeof speciesFiltersSchema>
