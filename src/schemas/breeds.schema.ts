import { z } from 'zod'

// Esquema base para raza - basado en la tabla breeds de Supabase
export const breedBaseSchema = z.object({
  name: z
    .string()
    .nonempty('El nombre de la raza es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  description: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional()
    .or(z.literal('')),
  species_id: z
    .string()
    .uuid('ID de especie inválido')
    .nonempty('La especie es requerida'),
  is_active: z.boolean().default(true),
})

// Esquema para crear raza
export const breedCreateSchema = breedBaseSchema

// Esquema para actualizar raza
export const breedUpdateSchema = breedBaseSchema.partial().extend({
  species_id: z.string().uuid('ID de especie inválido').optional(),
})

// Esquema para filtros de razas
export const breedFiltersSchema = z.object({
  search: z.string().optional(),
  species_id: z.string().uuid('ID de especie inválido').optional(),
  is_active: z.boolean().optional(),
})

// Tipos derivados
export type BreedCreate = z.infer<typeof breedCreateSchema>
export type BreedUpdate = z.infer<typeof breedUpdateSchema>
export type BreedFilters = z.infer<typeof breedFiltersSchema>
