import { z } from 'zod'

export const productBaseSchema = z.object({
  name: z.string().nonempty('El nombre es requerido'),
  price: z.coerce
    .number()
    .min(0, 'El precio debe ser mayor o igual a 0')
    .default(0),
  stock: z.coerce
    .number()
    .min(0, 'El stock debe ser mayor o igual a 0')
    .default(0),
  cost: z.coerce
    .number()
    .min(0, 'El costo debe ser mayor o igual a 0')
    .optional(),
  is_service: z.boolean().default(false),
  is_active: z.boolean().default(true),
  barcode: z.string().optional(),
  sku: z.string().optional(),
  notes: z.string().optional(),
  expiry_date: z.coerce.date().optional(),
  batch_number: z.string().optional(),
  brand_id: z.uuid('ID de marca inválido').optional(),
  category_id: z.uuid('ID de categoría inválido').optional(),
  unit_id: z.uuid('ID de unidad inválido').optional(),
})

export const createProductSchema = productBaseSchema

export const updateProductSchema = productBaseSchema.partial()

export const productFiltersSchema = z.object({
  search: z.string().optional(),
  is_active: z.boolean().optional(),
  is_service: z.boolean().optional(),
  category_id: z.string().uuid().optional(),
  brand_id: z.string().uuid().optional(),
  unit_id: z.string().uuid().optional(),
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
