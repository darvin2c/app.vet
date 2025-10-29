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
        label: 'Cash',
        icon: Banknote,
        description: 'Pay with cash',
      },
      {
        value: 'app',
        label: 'App',
        icon: Smartphone,
        description: 'Pay with app',
      },
      {
        value: 'credit',
        label: 'Credit Card',
        icon: CreditCard,
        description: 'Pay with credit card',
      },
      {
        value: 'others',
        label: 'Others',
        icon: RectangleEllipsis,
        description: 'Pay with others',
      },
    ],
    []
  )

  const getPaymentType = (value: Enums<'payment_type'>) =>
    paymentTypes.find((type) => type.value === value)

  return { paymentTypes, getPaymentType }
}
