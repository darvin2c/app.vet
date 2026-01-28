import { maskitoParseNumber } from '@maskito/kit'
import { z } from 'zod'

export const cartItemEditSchema = z.object({
  quantity: z.number().min(1, 'La cantidad debe ser mayor a 0'),
  unit_price: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        return maskitoParseNumber(val)
      }
      return val
    },
    z.number().min(0, 'El precio unitario debe ser mayor o igual a 0')
  ),
  discount: z
    .number()
    .min(0, 'El descuento debe ser mayor o igual a 0'),
  description: z.string().optional(),
})

export type CartItemEditSchema = z.infer<typeof cartItemEditSchema>

// Función helper para calcular totales de items del carrito
export function calculateCartItemTotal(item: {
  quantity: number
  unit_price: number
  discount?: number
}): {
  subtotal: number
  discountAmount: number
  total: number
} {
  const subtotal = item.quantity * item.unit_price
  // El descuento es por unidad, así que multiplicamos por la cantidad
  const discountAmount = (item.discount || 0) * item.quantity
  const total = subtotal - discountAmount

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
    total: Math.round(total * 100) / 100,
  }
}
