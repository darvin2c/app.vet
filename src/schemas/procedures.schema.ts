import { z } from 'zod'

// Esquema base para procedimiento - basado en la tabla procedures de Supabase
export const procedureBaseSchema = z.object({
  name: z
    .string()
    .nonempty('El nombre del procedimiento es requerido')
    .max(200, 'El nombre no puede exceder 200 caracteres'),

  code: z
    .string()
    .nonempty('El código del procedimiento es requerido')
    .max(50, 'El código no puede exceder 50 caracteres')
    .regex(
      /^[A-Z0-9-_]+$/,
      'El código debe contener solo letras mayúsculas, números, guiones y guiones bajos'
    ),

  description: z
    .string()
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .nullable()
    .optional(),

  base_price: z
    .number()
    .min(0, 'El precio base debe ser mayor o igual a 0')
    .max(999999.99, 'El precio base no puede exceder 999,999.99')
    .nullable()
    .optional(),

  cdt_code: z
    .string()
    .max(20, 'El código CDT no puede exceder 20 caracteres')
    .regex(
      /^[A-Z0-9-]*$/,
      'El código CDT debe contener solo letras mayúsculas, números y guiones'
    )
    .nullable()
    .optional(),

  snomed_code: z
    .string()
    .max(20, 'El código SNOMED no puede exceder 20 caracteres')
    .regex(/^[0-9]*$/, 'El código SNOMED debe contener solo números')
    .nullable()
    .optional(),

  is_active: z.boolean().default(true),
})

// Esquema para crear procedimiento
export const createProcedureSchema = procedureBaseSchema
  .omit({ is_active: true })
  .extend({
    is_active: z.boolean().default(true),
  })

// Esquema para actualizar procedimiento
export const updateProcedureSchema = procedureBaseSchema.partial()

// Esquema para filtros de búsqueda
export const procedureFiltersSchema = z.object({
  search: z.string().optional(),
  is_active: z.boolean().optional(),
  has_price: z.boolean().optional(),
  has_cdt_code: z.boolean().optional(),
  has_snomed_code: z.boolean().optional(),
  price_min: z.number().min(0).optional(),
  price_max: z.number().min(0).optional(),
  created_from: z.string().optional(),
  created_to: z.string().optional(),
})

// Tipos TypeScript derivados de los esquemas
export type CreateProcedureSchema = z.infer<typeof createProcedureSchema>
export type UpdateProcedureSchema = z.infer<typeof updateProcedureSchema>
export type ProcedureFilters = z.infer<typeof procedureFiltersSchema>

// Opciones para selects - valores alineados con Supabase
export const ProcedureActiveOptions = [
  { value: true, label: 'Activo' },
  { value: false, label: 'Inactivo' },
] as const

export const ProcedureHasPriceOptions = [
  { value: true, label: 'Con precio' },
  { value: false, label: 'Sin precio' },
] as const

export const ProcedureHasCodeOptions = [
  { value: true, label: 'Con código' },
  { value: false, label: 'Sin código' },
] as const
