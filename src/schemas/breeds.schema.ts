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
export const breedUpdateSchema = breedBaseSchema.partial()

export const breedImportSchema = z.object({
  name: z.string().nonempty('El nombre de la raza es requerido'),
  description: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional()
    .or(z.literal('')),
  is_active: z.coerce.boolean().default(true),
})

// Tipos derivados
export type BreedCreate = z.infer<typeof breedCreateSchema>
export type BreedUpdate = z.infer<typeof breedUpdateSchema>
