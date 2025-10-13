import { z } from 'zod'

// Esquema base para cliente - basado en la tabla customers de Supabase
export const customerBaseSchema = z.object({
  first_name: z
    .string()
    .nonempty('El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),

  last_name: z
    .string()
    .nonempty('El apellido es requerido')
    .max(100, 'El apellido no puede exceder 100 caracteres'),

  doc_id: z
    .string()
    .nonempty('El número de documento es requerido')
    .max(50, 'El número de documento no puede exceder 50 caracteres'),

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

  notes: z.string().optional(),
})

// Esquema para crear cliente
export const createCustomerSchema = customerBaseSchema

// Esquema para actualizar cliente
export const updateCustomerSchema = customerBaseSchema.partial()

// Esquema para filtros de búsqueda
export const customerFiltersSchema = z.object({
  search: z.string().optional(),
  is_active: z.boolean().optional(),
  created_from: z.string().optional(),
  created_to: z.string().optional(),
})

// Tipos TypeScript derivados de los esquemas
export type CreateCustomerSchema = z.infer<typeof createCustomerSchema>
export type UpdateCustomerSchema = z.infer<typeof updateCustomerSchema>
export type CustomerFilters = z.infer<typeof customerFiltersSchema>