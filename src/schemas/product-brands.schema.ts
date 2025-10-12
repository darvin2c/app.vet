import { z } from 'zod'

// Schema base para product brands
export const productBrandBaseSchema = z.object({
  name: z.string().nonempty('El nombre es requerido'),
  description: z.string().optional(),
})

// Schema para crear product brand
export const createProductBrandSchema = productBrandBaseSchema

// Schema para actualizar product brand
export const updateProductBrandSchema = productBrandBaseSchema.partial()

// Schema para filtros
export const productBrandFiltersSchema = z.object({
  search: z.string().optional(),
})

// Tipos TypeScript
export type ProductBrandBase = z.infer<typeof productBrandBaseSchema>
export type CreateProductBrand = z.infer<typeof createProductBrandSchema>
export type UpdateProductBrand = z.infer<typeof updateProductBrandSchema>
export type ProductBrandFilters = z.infer<typeof productBrandFiltersSchema>