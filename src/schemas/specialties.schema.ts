import { z } from 'zod'

// Esquema base para especialidad - basado en la tabla specialties de Supabase
export const specialtyBaseSchema = z.object({
  name: z
    .string()
    .nonempty('El nombre de la especialidad es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  code: z.string().nonempty('El código es requerido'),
  description: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional()
    .or(z.literal('')),
  is_active: z.boolean().default(true),
})

// Esquema para crear especialidad
export const createSpecialtySchema = z.object({
  name: z
    .string()
    .nonempty('El nombre de la especialidad es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  code: z.string().optional(),
  description: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional()
    .or(z.literal('')),
  is_active: z.boolean().optional().default(true),
})

// Esquema para actualizar especialidad
export const updateSpecialtySchema = specialtyBaseSchema.partial().extend({
  is_active: z.boolean().optional(),
})

// Esquema para filtros de especialidades
export const specialtyFiltersSchema = z.object({
  search: z.string().optional(),
  is_active: z.boolean().optional(),
})

// Tipos derivados
export type SpecialtyCreate = z.infer<typeof createSpecialtySchema>
export type SpecialtyUpdate = z.infer<typeof updateSpecialtySchema>
export type SpecialtyFilters = z.infer<typeof specialtyFiltersSchema>

// Tipos para compatibilidad
export type CreateSpecialtySchema = SpecialtyCreate
export type UpdateSpecialtySchema = SpecialtyUpdate
export const SpecialtySchema = createSpecialtySchema