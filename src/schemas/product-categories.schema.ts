import { z } from 'zod'

export const productCategoryBaseSchema = z.object({
  name: z.string().nonempty('El nombre es requerido'),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
})

export const productCategoryCreateSchema = productCategoryBaseSchema

export const productCategoryUpdateSchema = productCategoryBaseSchema.partial()

export const productCategoryImportSchema = productCategoryBaseSchema.extend({
  is_active: z.coerce.boolean().default(true),
})

export type ProductCategoryCreateSchema = z.infer<
  typeof productCategoryCreateSchema
>
export type ProductCategoryUpdateSchema = z.infer<
  typeof productCategoryUpdateSchema
>
