import { z } from 'zod'
import { Enums } from '@/types/supabase.types'

export const orderBaseSchema = z.object({
  customer_id: z.string(),
  order_number: z.string().optional(),
  subtotal: z
    .number()
    .min(0, 'El subtotal debe ser mayor o igual a 0')
    .default(0),
  tax: z.number().min(0, 'El impuesto debe ser mayor o igual a 0').default(0),
  total: z.number().min(0, 'El total debe ser mayor o igual a 0').default(0),
  paid_amount: z
    .number()
    .min(0, 'El monto pagado debe ser mayor o igual a 0')
    .default(0),
  notes: z.string().optional(),
})

export const createOrderSchema = orderBaseSchema
export const updateOrderSchema = orderBaseSchema.partial()

export type OrderBaseSchema = z.infer<typeof orderBaseSchema>
