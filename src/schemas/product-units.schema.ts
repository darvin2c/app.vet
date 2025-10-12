import { z } from 'zod'

export const productUnitBaseSchema = z.object({
  name: z.string().nonempty('El nombre es requerido'),
  code: z.string().nonempty('El código es requerido'),
  decimals: z
    .number()
    .min(0, 'Los decimales deben ser mayor o igual a 0')
    .max(4, 'Los decimales no pueden ser mayor a 4'),
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

export const activeStatusOptions = [
  { value: true, label: 'Activo' },
  { value: false, label: 'Inactivo' },
]
