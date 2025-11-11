import { maskitoParseNumber } from '@maskito/kit'
import { z } from 'zod'

export const posPaymentSchema = z.object({
  payment_method_id: z.string().nonempty('Selecciona un método de pago'),
  amount: z
    .number()
    .min(0.01, 'El monto debe ser mayor a 0')
    .max(999999.99, 'El monto es demasiado alto'),
  notes: z.string().optional(),
})

export type POSPaymentSchema = z.infer<typeof posPaymentSchema>
