import { z } from 'zod'

// Esquema base para cliente - basado en la tabla clients de Supabase
export const clientBaseSchema = z.object({
  full_name: z
    .string()
    .nonempty('El nombre completo es requerido')
    .max(200, 'El nombre completo no puede exceder 200 caracteres'),

  document_number: z
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
export const createClientSchema = clientBaseSchema

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
