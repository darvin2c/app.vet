import { z } from 'zod'

export const productCategoryBaseSchema = z.object({
  name: z.string().nonempty('El nombre es requerido'),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
})

export const createProductCategorySchema = productCategoryBaseSchema

export const updateProductCategorySchema = productCategoryBaseSchema.partial()

export const productCategoryFiltersSchema = z.object({
  search: z.string().optional(),
  is_active: z.boolean().optional(),
  created_from: z.string().optional(),
  created_to: z.string().optional(),
})

export type ProductCategoryBaseSchema = z.infer<
  typeof productCategoryBaseSchema
>
export type CreateProductCategorySchema = z.infer<
  typeof createProductCategorySchema
>
export type UpdateProductCategorySchema = z.infer<
  typeof updateProductCategorySchema
>
export type ProductCategoryFiltersSchema = z.infer<
  typeof productCategoryFiltersSchema
>

export const activeStatusOptions = [
  { value: true, label: 'Activo' },
  { value: false, label: 'Inactivo' },
]
