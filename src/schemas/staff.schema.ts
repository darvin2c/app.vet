import { z } from 'zod'

// Esquema base para staff - basado en la tabla staff de Supabase
export const staffBaseSchema = z.object({
  first_name: z
    .string()
    .nonempty('El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),

  last_name: z
    .string()
    .nonempty('El apellido es requerido')
    .max(100, 'El apellido no puede exceder 100 caracteres'),

  email: z.string().email('Formato de email inválido').nullable().optional(),

  phone: z
    .string()
    .nullable()
    .optional()
    .refine(
      (value) => {
        if (!value) return true // Permitir valores vacíos
        try {
          const { parsePhoneNumber } = require('libphonenumber-js')
          const phoneNumber = parsePhoneNumber(value, 'PE')
          return phoneNumber?.isValid() || false
        } catch {
          return false
        }
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

  // Especialidades se manejan por separado a través de la tabla staff_specialties
  specialty_ids: z
    .array(z.string())
    .optional()
    .default([])
    .refine(
      (value) => {
        if (!value) return true
        return value.length <= 10 // Máximo 10 especialidades por staff
      },
      {
        message: 'No se pueden asignar más de 10 especialidades',
      }
    ),

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

// Esquema para filtros de búsqueda
export const staffFiltersSchema = z.object({
  search: z.string().optional(),
  is_active: z.boolean().optional(),
  specialty_id: z.string().optional(), // Filtrar por una especialidad específica
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
