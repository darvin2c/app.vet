import { z } from 'zod'

export const orderBaseSchema = z.object({
  custumer_id: z.string().nonempty('El cliente es requerido'),
  pet_id: z.string().optional().or(z.literal('')),
  order_number: z.string().optional(),
  status: z
    .enum(['draft', 'confirmed', 'paid', 'cancelled', 'refunded'])
    .default('draft'),
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
  balance: z.number().optional(),
  notes: z.string().optional(),
})

export const createOrderSchema = orderBaseSchema

export const updateOrderSchema = orderBaseSchema.partial().extend({
  id: z.string().uuid('ID de orden inválido'),
})

export const orderFiltersSchema = z.object({
  search: z.string().optional(),
  status: z
    .enum(['draft', 'confirmed', 'paid', 'cancelled', 'refunded'])
    .optional(),
  custumer_id: z.string().optional(),
  pet_id: z.string().optional(),
  created_from: z.string().optional(),
  created_to: z.string().optional(),
  total_from: z.number().min(0).optional(),
  total_to: z.number().min(0).optional(),
})

export type OrderBaseSchema = z.infer<typeof orderBaseSchema>
export type CreateOrderSchema = z.infer<typeof createOrderSchema>
export type UpdateOrderSchema = z.infer<typeof updateOrderSchema>
export type OrderFiltersSchema = z.infer<typeof orderFiltersSchema>

export const orderStatusOptions = [
  { value: 'draft', label: 'Borrador', color: 'gray' },
  { value: 'confirmed', label: 'Confirmado', color: 'blue' },
  { value: 'paid', label: 'Pagado', color: 'green' },
  { value: 'cancelled', label: 'Cancelado', color: 'red' },
  { value: 'refunded', label: 'Reembolsado', color: 'orange' },
] as const
