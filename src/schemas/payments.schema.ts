import { z } from 'zod'

export const PaymentSchema = z.object({
  id: z.string().uuid(),
  amount: z.number().positive('El monto debe ser mayor a 0'),
  customer_id: z.string().uuid(),
  order_id: z.string().uuid(),
  payment_method_id: z.string().uuid(),
  payment_date: z.string(),
  notes: z.string().nullable().optional(),
  tenant_id: z.string().uuid(),
  created_at: z.string(),
  created_by: z.string().uuid().nullable(),
  updated_at: z.string(),
  updated_by: z.string().uuid().nullable(),
})

export const PaymentCreateSchema = PaymentSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  tenant_id: true,
})

export const PaymentUpdateSchema = PaymentCreateSchema.partial()

// Schema para múltiples pagos en el POS
export const MultiplePaymentSchema = z.object({
  payment_method_id: z.string().nonempty('Selecciona un método de pago'),
  amount: z.number().positive('El monto debe ser mayor a 0'),
  notes: z.string().optional(),
})

export const MultiplePaymentsFormSchema = z
  .object({
    payments: z
      .array(MultiplePaymentSchema)
      .min(1, 'Debe agregar al menos un pago'),
    total_order: z.number().positive(),
    total_paid: z.number(),
    change: z.number(),
    remaining: z.number(),
  })
  .refine((data) => data.total_paid >= data.total_order, {
    message: 'El total pagado debe cubrir el monto de la orden',
    path: ['payments'],
  })

export type Payment = z.infer<typeof PaymentSchema>
export type PaymentCreate = z.infer<typeof PaymentCreateSchema>
export type PaymentUpdate = z.infer<typeof PaymentUpdateSchema>
export type MultiplePayment = z.infer<typeof MultiplePaymentSchema>
export type MultiplePaymentsForm = z.infer<typeof MultiplePaymentsFormSchema>
