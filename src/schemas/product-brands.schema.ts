import { z } from 'zod'

// Schema base para product brands
export const productBrandBaseSchema = z.object({
  name: z.string().nonempty('El nombre es requerido'),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
})

// Schema para crear product brand
export const productBrandCreateSchema = productBrandBaseSchema
export const productBrandUpdateSchema = productBrandBaseSchema.partial()
export const productBrandImportSchema = productBrandBaseSchema.extend({
  is_active: z.coerce.boolean().default(true),
})

export type ProductBrandCreateSchema = z.infer<typeof productBrandCreateSchema>
export type ProductBrandUpdateSchema = z.infer<typeof productBrandUpdateSchema>
