import { z } from 'zod'
import { Enums } from '@/types/supabase.types'

export const orderBaseSchema = z.object({
  custumer_id: z.string().nonempty('El cliente es requerido'),
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

// Schema con validaciones de estados de pago
export const orderWithPaymentValidationSchema = orderBaseSchema.refine(
  (data) => {
    // No permitir pagos que excedan el total
    return data.paid_amount <= data.total
  },
  {
    message: 'El monto pagado no puede exceder el total de la orden',
    path: ['paid_amount'],
  }
)

export const createOrderSchema = orderWithPaymentValidationSchema

export const updateOrderSchema = orderWithPaymentValidationSchema
  .partial()
  .extend({
    id: z.string().uuid('ID de orden inválido'),
  })

// Schema específico para pagos
export const paymentSchema = z.object({
  order_id: z.string().uuid('ID de orden inválido'),
  payment_amount: z.number().min(0.01, 'El monto del pago debe ser mayor a 0'),
})

export const orderFiltersSchema = z.object({
  search: z.string().optional(),
  status: z
    .enum(['draft', 'confirmed', 'paid', 'cancelled', 'refunded'])
    .optional(),
  custumer_id: z.string().optional(),
  created_from: z.string().optional(),
  created_to: z.string().optional(),
  total_from: z.number().min(0).optional(),
  total_to: z.number().min(0).optional(),
  payment_status: z.enum(['pending', 'partial', 'completed']).optional(),
})

export type OrderBaseSchema = z.infer<typeof orderBaseSchema>
export type UpdateOrderSchema = z.infer<typeof updateOrderSchema>
export type PaymentSchema = z.infer<typeof paymentSchema>
export type OrderFiltersSchema = z.infer<typeof orderFiltersSchema>

export const orderStatusOptions = [
  { value: 'draft', label: 'Borrador', color: 'gray' },
  { value: 'confirmed', label: 'Confirmado', color: 'blue' },
  { value: 'paid', label: 'Pagado', color: 'green' },
  { value: 'cancelled', label: 'Cancelado', color: 'red' },
  { value: 'refunded', label: 'Reembolsado', color: 'orange' },
] as const

// Opciones de estado de pago para filtros y UI
export const paymentStatusOptions = [
  { value: 'pending', label: 'Pendiente', color: 'yellow', icon: '⏳' },
  { value: 'partial', label: 'Parcial', color: 'orange', icon: '⚡' },
  { value: 'completed', label: 'Completado', color: 'green', icon: '✅' },
] as const

// Funciones de utilidad para estados de pago
export const getPaymentStatus = (
  paid_amount: number,
  total: number
): 'pending' | 'partial' | 'completed' => {
  if (paid_amount === 0) return 'pending'
  if (paid_amount >= total) return 'completed'
  return 'partial'
}

export const calculateBalance = (
  total: number,
  paid_amount: number
): number => {
  return Math.max(0, total - paid_amount)
}

export const getOrderStatusFromPayment = (
  paid_amount: number,
  total: number
): Enums<'order_status'> => {
  if (paid_amount === 0) return 'confirmed'
  if (paid_amount >= total) return 'paid'
  return 'confirmed' // Para pagos parciales mantenemos como confirmado
}

export const canAddPayment = (
  paid_amount: number,
  total: number,
  new_payment: number
): boolean => {
  return paid_amount + new_payment <= total
}

export const getPaymentStatusInfo = (paid_amount: number, total: number) => {
  const status = getPaymentStatus(paid_amount, total)
  const balance = calculateBalance(total, paid_amount)
  const statusOption = paymentStatusOptions.find(
    (option) => option.value === status
  )

  return {
    status,
    balance,
    statusOption,
    percentage: total > 0 ? Math.round((paid_amount / total) * 100) : 0,
  }
}
