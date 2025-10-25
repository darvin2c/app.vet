import { z } from 'zod'

export const PaymentMethodSchema = z.object({
  id: z.string().uuid(),
  code: z.string().nonempty('El código es requerido'),
  name: z.string().nonempty('El nombre es requerido'),
  payment_type: z.enum(['cash', 'app', 'credit', 'others']),
  is_active: z.boolean().default(true),
  sort_order: z.number().nullable().optional(),
  tenant_id: z.string().uuid(),
  created_at: z.string(),
  updated_at: z.string(),
  created_by: z.string().uuid().nullable(),
  updated_by: z.string().uuid().nullable(),
})

export const PaymentMethodCreateSchema = PaymentMethodSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  tenant_id: true,
}).extend({
  is_active: z.boolean().optional().default(true),
  sort_order: z.number().nullable().optional(),
})

export const PaymentMethodUpdateSchema = PaymentMethodCreateSchema.partial()

export type PaymentMethod = z.infer<typeof PaymentMethodSchema>
export type PaymentMethodCreate = z.infer<typeof PaymentMethodCreateSchema>
export type PaymentMethodUpdate = z.infer<typeof PaymentMethodUpdateSchema>
