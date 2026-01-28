import { z } from 'zod'

export const orderItemBaseSchema = z.object({
  order_id: z.string().uuid('ID de orden inválido'),
  product_id: z.string().uuid('ID de producto inválido').optional(),
  description: z.string().nonempty('La descripción es requerida'),
  quantity: z.number().min(1, 'La cantidad debe ser mayor a 0'),
  unit_price: z
    .number()
    .min(0, 'El precio unitario debe ser mayor o igual a 0'),
  discount: z
    .number()
    .min(0, 'El descuento debe ser mayor o igual a 0')
    .default(0),
  tax_rate: z
    .number()
    .min(0)
    .max(1, 'La tasa de impuesto debe estar entre 0 y 1')
    .default(0),
  total: z.number().min(0, 'El total debe ser mayor o igual a 0').optional(),
})

export const createOrderItemSchema = orderItemBaseSchema

export const updateOrderItemSchema = orderItemBaseSchema.partial().extend({
  id: z.string().uuid('ID de item inválido'),
})

export const orderItemFiltersSchema = z.object({
  order_id: z.string().uuid().optional(),
  product_id: z.string().uuid().optional(),
  description: z.string().optional(),
})

export type OrderItemBaseSchema = z.infer<typeof orderItemBaseSchema>
export type CreateOrderItemSchema = z.infer<typeof createOrderItemSchema>
export type UpdateOrderItemSchema = z.infer<typeof updateOrderItemSchema>
export type OrderItemFiltersSchema = z.infer<typeof orderItemFiltersSchema>

// Esquema para el cálculo de totales de items
export const orderItemCalculationSchema = z.object({
  quantity: z.number().min(1),
  unit_price: z.number().min(0),
  discount: z.number().min(0).default(0),
  tax_rate: z.number().min(0).max(1).default(0),
})

export type OrderItemCalculationSchema = z.infer<
  typeof orderItemCalculationSchema
>

// Función helper para calcular totales de items
export function calculateOrderItemTotal(item: OrderItemCalculationSchema): {
  subtotal: number
  tax: number
  total: number
} {
  const subtotal = item.quantity * item.unit_price
  // Descuento es unitario, multiplicamos por la cantidad
  const discountAmount = item.discount * item.quantity
  const subtotalAfterDiscount = subtotal - discountAmount
  const taxAmount = subtotalAfterDiscount * item.tax_rate

  return {
    subtotal: subtotalAfterDiscount,
    tax: taxAmount,
    total: subtotalAfterDiscount + taxAmount,
  }
}
