import { z } from 'zod'

export const ProductMovementSchema = z.object({
  product_id: z.string().nonempty('El producto es requerido'),
  quantity: z.number().min(0.01, 'La cantidad debe ser mayor a 0'),
  movement_date: z.date(),
  unit_cost: z
    .number()
    .min(0, 'El costo unitario debe ser mayor o igual a 0')
    .optional()
    .or(z.literal(0)),
  total_cost: z
    .number()
    .min(0, 'El costo total debe ser mayor o igual a 0')
    .optional()
    .or(z.literal(0)),
  note: z.string().optional().or(z.literal('')),
  reference_type: z.string().optional().or(z.literal('')),
  reference_id: z.string().optional().or(z.literal('')),
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
