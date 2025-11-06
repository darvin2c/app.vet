import { z } from 'zod'
import { isValidPhoneNumber } from 'libphonenumber-js'
import parsePhoneNumber from 'libphonenumber-js/max'

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
  email: z.email('Formato de email inválido').or(z.literal('')).optional(),
  phone: z
    .string()
    .nullable()
    .optional()
    .refine(
      (value) => {
        if (!value) return true // Permitir valores vacíos
        try {
          // Validación robusta usando libphonenumber-js
          const parsed = parsePhoneNumber(value)
          return parsed?.isValid() || isValidPhoneNumber(value)
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
  user_id: z.string().optional(),
  is_active: z.boolean().default(true),
})

// Esquema para crear staff
export const staffCreateSchema = staffBaseSchema

// Esquema para actualizar staff
export const staffUpdateSchema = staffBaseSchema.partial()

export const staffImportSchema = staffBaseSchema.extend({
  is_active: z.coerce.boolean().default(true),
})

export type StaffCreateSchema = z.infer<typeof staffCreateSchema>
export type StaffUpdateSchema = z.infer<typeof staffUpdateSchema>
