import { z } from 'zod'

// Esquema base para staff - basado en la tabla staff de Supabase
export const staffBaseSchema = z.object({
  full_name: z
    .string()
    .nonempty('El nombre completo es requerido')
    .max(200, 'El nombre completo no puede exceder 200 caracteres'),

  email: z.string().email('Formato de email inválido').nullable().optional(),

  phone: z
    .string()
    .nullable()
    .optional()
    .refine(
      (value) => {
        if (!value) return true // Permitir valores vacíos
        // Validar formato de teléfono básico (números, espacios, guiones, paréntesis)
        return /^[\d\s\-\(\)\+]+$/.test(value)
      },
      {
        message: 'Formato de teléfono inválido',
      }
    ),

  license_number: z
    .string()
    .nullable()
    .optional()
    .refine(
      (value) => {
        if (!value) return true // Permitir valores vacíos
        // Validación básica para número de licencia (puede ser personalizada según el país)
        return value.length >= 3 && value.length <= 50
      },
      {
        message: 'El número de licencia debe tener entre 3 y 50 caracteres',
      }
    ),

  user_id: z
    .string()
    .nonempty('El ID de usuario es requerido'),

  is_active: z.boolean().default(true),
})

// Esquema para crear staff
export const createStaffSchema = staffBaseSchema
  .omit({ is_active: true })
  .extend({
    is_active: z.boolean().default(true),
  })

// Esquema para actualizar staff
export const updateStaffSchema = staffBaseSchema.partial()

// Esquema para filtros de staff
export const staffFiltersSchema = z.object({
  search: z.string().optional(),
  is_active: z.boolean().optional(),
  created_from: z.string().optional(),
  created_to: z.string().optional(),
})

// Tipos TypeScript derivados de los esquemas
export type CreateStaffSchema = z.infer<typeof createStaffSchema>
export type UpdateStaffSchema = z.infer<typeof updateStaffSchema>
export type StaffFilters = z.infer<typeof staffFiltersSchema>

// Las especialidades ahora se obtienen dinámicamente de la tabla specialties
// Se mantienen las opciones de estado activo

export const StaffActiveOptions = [
  { value: true, label: 'Activo' },
  { value: false, label: 'Inactivo' },
] as const
