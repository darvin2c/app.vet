import { z } from 'zod'

export const productUnitBaseSchema = z.object({
  name: z.string().nonempty('El nombre es requerido'),
  abbreviation: z.string().nonempty('La abreviación es requerida').nullable(),
  is_active: z.boolean().default(true),
})

export const createProductUnitSchema = productUnitBaseSchema.required()

export const updateProductUnitSchema = productUnitBaseSchema.partial()

export const productUnitFiltersSchema = z.object({
  search: z.string().optional(),
  is_active: z.boolean().optional(),
  created_from: z.string().optional(),
  created_to: z.string().optional(),
})

export type ProductUnitBaseSchema = z.infer<typeof productUnitBaseSchema>
export type CreateProductUnitSchema = z.infer<typeof createProductUnitSchema>
export type UpdateProductUnitSchema = z.infer<typeof updateProductUnitSchema>
export type ProductUnitFiltersSchema = z.infer<typeof productUnitFiltersSchema>

// Tipos para compatibilidad
export type ProductUnitSchemaType = CreateProductUnitSchema
export const ProductUnitSchema = createProductUnitSchema

export const activeStatusOptions = [
  { value: true, label: 'Activo' },
  { value: false, label: 'Inactivo' },
]
