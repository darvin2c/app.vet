import { z } from 'zod'

// Esquema base para especialidad - basado en la tabla specialties de Supabase
export const specialtyBaseSchema = z.object({
  name: z
    .string()
    .nonempty('El nombre de la especialidad es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),

  is_active: z.boolean().default(true),
})

// Esquema para crear especialidad
export const createSpecialtySchema = specialtyBaseSchema
  .omit({ is_active: true })
  .extend({
    is_active: z.boolean().default(true),
  })

// Esquema para actualizar especialidad
export const updateSpecialtySchema = specialtyBaseSchema.partial()

// Esquema para filtros de búsqueda
export const specialtyFiltersSchema = z.object({
  search: z.string().optional(),
  is_active: z.boolean().optional(),
  created_from: z.string().optional(),
  created_to: z.string().optional(),
})

// Tipos TypeScript derivados de los esquemas
export type CreateSpecialtySchema = z.infer<typeof createSpecialtySchema>
export type UpdateSpecialtySchema = z.infer<typeof updateSpecialtySchema>
export type SpecialtyFilters = z.infer<typeof specialtyFiltersSchema>

// Opciones para selects - valores alineados con Supabase
export const SpecialtyActiveOptions = [
  { value: true, label: 'Activo' },
  { value: false, label: 'Inactivo' },
] as const
