import { z } from 'zod'
import { Constants } from '@/types/supabase.types'

export const paymentMethodSchema = z.object({
  name: z.string().nonempty('El nombre es requerido'),
  payment_type: z.enum(Constants.public.Enums.payment_type),
  ref_required: z.boolean().default(false),
  is_active: z.boolean().default(true),
})

export const paymentMethodCreateSchema = paymentMethodSchema
export const paymentMethodUpdateSchema = paymentMethodCreateSchema.partial()

// Aliases to match component imports expecting PascalCase exports
export { paymentMethodCreateSchema as PaymentMethodCreateSchema }
export { paymentMethodUpdateSchema as PaymentMethodUpdateSchema }

export const paymentMethodImportSchema = paymentMethodSchema.extend({
  is_active: z.coerce.boolean().optional().default(true),
  ref_required: z.coerce.boolean().optional().default(false),
})

export type PaymentMethod = z.infer<typeof paymentMethodSchema>
export type PaymentMethodCreate = z.infer<typeof paymentMethodCreateSchema>
export type PaymentMethodUpdate = z.infer<typeof paymentMethodUpdateSchema>
