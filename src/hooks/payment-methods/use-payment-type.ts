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
  badgeClass: string
}

export const usePaymentType = () => {
  const paymentTypes: PaymentType[] = useMemo(
    () => [
      {
        value: 'cash',
        label: 'Efectivo',
        icon: Banknote,
        description: 'Paga con efectivo',
        badgeClass: 'bg-green-100 text-green-800',
      },
      {
        value: 'wallet',
        label: 'Billetera electrónica',
        icon: Smartphone,
        description: 'Paga con la billetera electrónica',
        badgeClass: 'bg-blue-100 text-blue-800',
      },
      {
        value: 'card',
        label: 'Tarjeta de Crédito/Débito',
        icon: CreditCard,
        description: 'Paga con tarjeta de crédito o débito',
        badgeClass: 'bg-purple-100 text-purple-800',
      },
      {
        value: 'transfer',
        label: 'Transferencia',
        icon: ArrowLeftRight,
        description: 'Paga por transferencia',
        badgeClass: 'bg-yellow-100 text-yellow-800',
      },
      {
        value: 'other',
        label: 'Otros',
        icon: RectangleEllipsis,
        description: 'Paga con otros métodos',
        badgeClass: 'bg-gray-100 text-gray-800',
      },
    ],
    []
  )

  const getPaymentType = (value: Enums<'payment_type'>) =>
    paymentTypes.find((type) => type.value === value)

  return { paymentTypes, getPaymentType }
}
