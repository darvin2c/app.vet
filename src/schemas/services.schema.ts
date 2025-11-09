import { z } from 'zod'

export const serviceBaseSchema = z.object({
  name: z.string().nonempty('El nombre es requerido'),
  price: z.number().min(0, 'El precio debe ser mayor o igual a 0').default(0),
  cost: z.number().min(0, 'El costo debe ser mayor o igual a 0').optional(),
  is_active: z.boolean().default(true),
  barcode: z.string().optional(),
  sku: z.string().optional(),
  notes: z.string().optional(),
  brand_id: z.uuid('ID de marca inválido').optional(),
  category_id: z.uuid('ID de categoría inválido').optional(),
  unit_id: z.uuid('ID de unidad inválido').optional(),
})

export const serviceCreateSchema = serviceBaseSchema
export const serviceUpdateSchema = serviceBaseSchema.partial()
export const serviceImportSchema = serviceBaseSchema.extend({
  price: z.coerce
    .number()
    .min(0, 'El precio debe ser mayor o igual a 0')
    .default(0),
  cost: z.coerce
    .number()
    .min(0, 'El costo debe ser mayor o igual a 0')
    .optional(),
  is_active: z.boolean().default(true),
})

export type ServiceCreateSchema = z.infer<typeof serviceCreateSchema>
export type ServiceUpdateSchema = z.infer<typeof serviceUpdateSchema>
