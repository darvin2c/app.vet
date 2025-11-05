import { z } from 'zod'

// Esquema base para staff - basado en la tabla staff de Supabase
export const staffBaseSchema = z.object({
  first_name: z
    .string()
    .nonempty('El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),

  last_name: z
    .string()
    .nullable()
    .optional()
    .refine(
      (value) => {
        if (!value) return true
        return value.length <= 100
      },
      {
        message: 'El apellido no puede exceder 100 caracteres',
      }
    ),

  email: z.email('Formato de email inválido').or(z.literal('')).optional(),

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

  address: z
    .string()
    .nullable()
    .optional()
    .refine(
      (value) => {
        if (!value) return true // Permitir valores vacíos
        return value.length <= 500
      },
      {
        message: 'La dirección no puede exceder 500 caracteres',
      }
    ),

  user_id: z.string().nullable(),

  is_active: z.boolean(),
})

// Esquema para crear staff
export const createStaffSchema = staffBaseSchema

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

// Tipos para compatibilidad
export type StaffSchema = CreateStaffSchema
export const StaffSchema = createStaffSchema
export type StaffSchemaType = CreateStaffSchema

// Las especialidades ahora se obtienen dinámicamente de la tabla specialties
// Se mantienen las opciones de estado activo

export const StaffActiveOptions = [
  { value: true, label: 'Activo' },
  { value: false, label: 'Inactivo' },
] as const
