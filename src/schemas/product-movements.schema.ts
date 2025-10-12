import { z } from 'zod'

export const ProductMovementSchema = z.object({
  product_id: z.string().uuid('ID de producto inválido'),
  quantity: z.number().min(0.01, 'La cantidad debe ser mayor a 0'),
  unit_cost: z
    .number()
    .min(0, 'El costo unitario debe ser mayor o igual a 0')
    .optional(),
  note: z.string().optional(),
  reference: z.string().optional(),
  source: z.string().optional(),
  related_id: z.string().optional(),
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

// Enum para tipos de referencia comunes
export const MovementReferenceType = {
  ENTRY: 'ENTRADA',
  EXIT: 'SALIDA',
  ADJUSTMENT: 'AJUSTE',
  TRANSFER: 'TRANSFERENCIA',
} as const

export type MovementReferenceTypeValue =
  (typeof MovementReferenceType)[keyof typeof MovementReferenceType]
