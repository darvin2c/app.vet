import { Enums } from '@/types/supabase.types'
import {
  Banknote,
  CreditCard,
  LucideIcon,
  RectangleEllipsis,
  Smartphone,
} from 'lucide-react'
import { useMemo } from 'react'

type PaymentType = {
  value: Enums<'payment_type'>
  label: string
  icon: LucideIcon
  description: string
}

export const usePaymentType = () => {
  const paymentTypes: PaymentType[] = useMemo(
    () => [
      {
        value: 'cash',
        label: 'Efectivo',
        icon: Banknote,
        description: 'Paga con efectivo',
      },
      {
        value: 'app',
        label: 'App',
        icon: Smartphone,
        description: 'Paga con la app',
      },
      {
        value: 'credit',
        label: 'Tarjeta de Crédito',
        icon: CreditCard,
        description: 'Paga con tarjeta de crédito',
      },
      {
        value: 'others',
        label: 'Otros',
        icon: RectangleEllipsis,
        description: 'Paga con otros métodos',
      },
    ],
    []
  )

  const getPaymentType = (value: Enums<'payment_type'>) =>
    paymentTypes.find((type) => type.value === value)

  return { paymentTypes, getPaymentType }
}
