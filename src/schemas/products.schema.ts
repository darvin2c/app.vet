import { z } from 'zod'

export const productBaseSchema = z.object({
  name: z.string().nonempty('El nombre es requerido'),
  sku: z.string().nonempty('El SKU es requerido'),
  min_stock: z.number().min(0, 'El stock mínimo debe ser mayor o igual a 0'),
  category_id: z.string().nonempty('La categoría es requerida'),
  unit_id: z.string().nonempty('La unidad es requerida'),
  is_active: z.boolean().default(true),
})

export const createProductSchema = productBaseSchema.extend({
  stock: z.number().min(0, 'El stock debe ser mayor o igual a 0').optional(),
})

export const updateProductSchema = productBaseSchema.partial()

export const productFiltersSchema = z.object({
  search: z.string().optional(),
  is_active: z.boolean().optional(),
  category_id: z.string().optional(),
  unit_id: z.string().optional(),
  min_stock_from: z.number().optional(),
  min_stock_to: z.number().optional(),
  created_from: z.string().optional(),
  created_to: z.string().optional(),
})

export type ProductBaseSchema = z.infer<typeof productBaseSchema>
export type CreateProductSchema = z.infer<typeof createProductSchema>
export type UpdateProductSchema = z.infer<typeof updateProductSchema>
export type ProductFiltersSchema = z.infer<typeof productFiltersSchema>

export const activeStatusOptions = [
  { value: true, label: 'Activo' },
  { value: false, label: 'Inactivo' },
]
