import { z } from 'zod'

export const PaymentSchema = z.object({
  amount: z
    .number()
    .min(0.01, 'El monto debe ser mayor a 0')
    .refine((val) => val > 0, {
      message: 'El monto debe ser mayor a 0',
    }),
  payment_method_id: z.string().nonempty('El método de pago es requerido'),
  payment_date: z.string().nonempty('La fecha de pago es requerida'),
  customer_id: z.string().nullable().optional(),
  order_id: z.string().nullable().optional(),
  reference: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
})

export const CreatePaymentSchema = PaymentSchema.extend({
  // Campos adicionales para la creación si son necesarios
})

export const UpdatePaymentSchema = PaymentSchema.pick({
  reference: true,
  notes: true,
}).partial()

export type PaymentFormData = z.infer<typeof PaymentSchema>
export type CreatePaymentData = z.infer<typeof CreatePaymentSchema>
export type UpdatePaymentData = z.infer<typeof UpdatePaymentSchema>