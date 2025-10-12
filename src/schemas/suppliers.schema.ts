import { z } from 'zod'

// Esquema base para proveedor - basado en la tabla suppliers de Supabase
export const supplierBaseSchema = z.object({
  name: z
    .string()
    .nonempty('El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),

  contact_person: z
    .string()
    .max(100, 'El nombre de contacto no puede exceder 100 caracteres')
    .optional(),

  email: z
    .string()
    .email('Formato de email inválido')
    .optional()
    .or(z.literal('')),

  phone: z
    .string()
    .max(20, 'El teléfono no puede exceder 20 caracteres')
    .optional(),

  address: z
    .string()
    .max(255, 'La dirección no puede exceder 255 caracteres')
    .optional(),

  document_number: z
    .string()
    .max(50, 'El número de documento no puede exceder 50 caracteres')
    .optional(),

  website: z
    .string()
    .url('Formato de URL inválido')
    .optional()
    .or(z.literal('')),

  notes: z.string().optional(),

  is_active: z.boolean().default(true),
})

// Esquema para crear proveedor
export const createSupplierSchema = supplierBaseSchema

// Esquema para actualizar proveedor
export const updateSupplierSchema = supplierBaseSchema.partial()

// Esquema para filtros de búsqueda
export const supplierFiltersSchema = z.object({
  search: z.string().optional(),
  is_active: z.boolean().optional(),
  created_from: z.string().optional(),
  created_to: z.string().optional(),
})

// Tipos TypeScript derivados de los esquemas
export type CreateSupplierSchema = z.infer<typeof createSupplierSchema>
export type UpdateSupplierSchema = z.infer<typeof updateSupplierSchema>
export type SupplierFilters = z.infer<typeof supplierFiltersSchema>