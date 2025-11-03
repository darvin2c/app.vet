import { z } from 'zod'

export const ProductMovementSchema = z.object({
  product_id: z.string().nonempty('El producto es requerido'),
  quantity: z.number().refine((val) => val !== 0, {
    message: 'La cantidad no puede ser 0',
  }),
  unit_cost: z
    .number()
    .min(0, 'El costo unitario debe ser mayor o igual a 0')
    .nullable()
    .optional(),
  note: z.string().nullable().optional(),
  reference: z.string().nullable().optional(),
})

export const CreateProductMovementSchema = ProductMovementSchema.extend({
  // Campos adicionales para la creación si son necesarios
})

export const UpdateProductMovementSchema = ProductMovementSchema.partial()

export type ProductMovementFormData = z.infer<typeof ProductMovementSchema>
export type CreateProductMovementData = z.infer<
  typeof CreateProductMovementSchema
>
export type UpdateProductMovementData = z.infer<
  typeof UpdateProductMovementSchema
>
