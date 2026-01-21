import { Enums } from '@/types/supabase.types'
import {
  Banknote,
  CreditCard,
  LucideIcon,
  RectangleEllipsis,
  Smartphone,
  ArrowLeftRight,
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
        value: 'wallet',
        label: 'Billetera electrónica',
        icon: Smartphone,
        description: 'Paga con la billetera electrónica',
      },
      {
        value: 'card',
        label: 'Tarjeta de Crédito/Débito',
        icon: CreditCard,
        description: 'Paga con tarjeta de crédito o débito',
      },
      {
        value: 'transfer',
        label: 'Transferencia',
        icon: ArrowLeftRight,
        description: 'Paga por transferencia',
      },
      {
        value: 'other',
        label: 'Otros',
        icon: RectangleEllipsis,
        description: 'Paga con otros métodos',
      },
    ],
    []
  )

  const getPaymentType = (value?: Enums<'payment_type'>) =>
    paymentTypes.find((type) => type.value === value)

  return { paymentTypes, getPaymentType }
}
