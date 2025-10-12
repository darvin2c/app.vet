import { z } from 'zod'

// Esquema base para paciente - basado en la tabla patients de Supabase
export const patientBaseSchema = z.object({
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

  date_of_birth: z.string().nullable().optional(),

  sex: z.enum(['M', 'F']).nullable().optional(),

  address: z.string().nullable().optional(),

  allergies: z.string().nullable().optional(),

  systemic_diseases: z.string().nullable().optional(),

  is_active: z.boolean().default(true),
})

// Esquema para crear paciente
export const createPatientSchema = patientBaseSchema
  .omit({ is_active: true })
  .extend({
    is_active: z.boolean().default(true),
  })

// Esquema para actualizar paciente
export const updatePatientSchema = patientBaseSchema.partial()

// Esquema para filtros de búsqueda
export const patientFiltersSchema = z.object({
  search: z.string().optional(),
  is_active: z.boolean().optional(),
  sex: z.enum(['M', 'F']).optional(),
  created_from: z.string().optional(),
  created_to: z.string().optional(),
})

// Tipos TypeScript derivados de los esquemas
export type CreatePatientSchema = z.infer<typeof createPatientSchema>
export type UpdatePatientSchema = z.infer<typeof updatePatientSchema>
export type PatientFilters = z.infer<typeof patientFiltersSchema>

// Opciones para selects - valores alineados con Supabase
export const PatientSexOptions = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Femenino' },
] as const

export const PatientActiveOptions = [
  { value: true, label: 'Activo' },
  { value: false, label: 'Inactivo' },
] as const
