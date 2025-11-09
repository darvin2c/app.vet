import { z } from 'zod'

export const productBaseSchema = z.object({
  name: z.string().nonempty('El nombre es requerido'),
  price: z.number().min(0, 'El precio debe ser mayor o igual a 0').default(0),
  stock: z.number().min(0, 'El stock debe ser mayor o igual a 0').default(0),
  cost: z.number().min(0, 'El costo debe ser mayor o igual a 0').optional(),
  is_active: z.boolean().default(true),
  barcode: z.string().optional(),
  sku: z.string().optional(),
  notes: z.string().optional(),
  expiry_date: z.date().optional(),
  batch_number: z.string().optional(),
  brand_id: z.uuid('ID de marca inválido').optional(),
  category_id: z.uuid('ID de categoría inválido').optional(),
  unit_id: z.uuid('ID de unidad inválido').optional(),
})

export const productCreateSchema = productBaseSchema

export const productUpdateSchema = productBaseSchema.partial()

export const productImportSchema = productBaseSchema.extend({
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
  expiry_date: z.coerce.date().optional(),
  batch_number: z.string().optional(),
  is_active: z.boolean().default(true),
})

export type ProductCreateSchema = z.infer<typeof productCreateSchema>
export type ProductUpdateSchema = z.infer<typeof productUpdateSchema>
