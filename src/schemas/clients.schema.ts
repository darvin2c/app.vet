import { z } from 'zod'

// Esquema base para cliente - basado en la tabla clients de Supabase
export const clientBaseSchema = z.object({
  first_name: z
    .string()
    .nonempty('El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),

  last_name: z
    .string()
    .nonempty('El apellido es requerido')
    .max(100, 'El apellido no puede exceder 100 caracteres'),

  email: z
    .string()
    .email('Formato de email inválido')
    .optional()
    .or(z.literal('')),

  phone: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value || value === '') return true
        // Validar formato de teléfono básico (números, espacios, guiones, paréntesis)
        return /^[\d\s\-\(\)\+]+$/.test(value)
      },
      {
        message: 'Formato de teléfono inválido',
      }
    ),

  address: z.string().optional(),

  date_of_birth: z.string().optional(),

  emergency_contact_name: z.string().optional(),

  emergency_contact_phone: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value || value === '') return true
        return /^[\d\s\-\(\)\+]+$/.test(value)
      },
      {
        message: 'Formato de teléfono de emergencia inválido',
      }
    ),

  notes: z.string().optional(),

  is_active: z.boolean().default(true),
})

// Esquema para crear cliente
export const createClientSchema = clientBaseSchema
  .omit({ is_active: true })
  .extend({
    is_active: z.boolean().default(true),
  })

// Esquema para actualizar cliente
export const updateClientSchema = clientBaseSchema.partial()

// Esquema para filtros de búsqueda
export const clientFiltersSchema = z.object({
  search: z.string().optional(),
  is_active: z.boolean().optional(),
  created_from: z.string().optional(),
  created_to: z.string().optional(),
})

// Tipos TypeScript derivados de los esquemas
export type CreateClientSchema = z.infer<typeof createClientSchema>
export type UpdateClientSchema = z.infer<typeof updateClientSchema>
export type ClientFilters = z.infer<typeof clientFiltersSchema>