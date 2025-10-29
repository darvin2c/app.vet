'use client'

import { Enums } from '@/types/supabase.types'

type OrderStatus = {
  label: string
  value: Enums<'order_status'>
  // colors
  className: string
}

export default function useOrderStatus() {
  const orderStatusOptions: OrderStatus[] = [
    {
      label: 'Confirmado',
      value: 'confirmed',
      className: 'bg-default text-default-foreground',
    },
    {
      label: 'Pagado',
      value: 'paid',
      className: 'bg-default text-default-foreground',
    },
    {
      label: 'Cancelado',
      value: 'cancelled',
      className: 'bg-destructive text-destructive-foreground',
    },
    {
      label: 'Devuelto',
      value: 'refunded',
      className: 'bg-outline text-outline-foreground',
    },
  ]

  function getOrderStatus(status: Enums<'order_status'>) {
    return (
      orderStatusOptions.find((item) => item.value === status) || {
        label: status,
        value: status,
        className: 'bg-gray text-gray-foreground',
      }
    )
  }
  return {
    orderStatusOptions,
    getOrderStatus,
  }
}
