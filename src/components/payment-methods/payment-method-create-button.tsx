'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { PaymentMethodCreate } from './payment-method-create'
import CanAccess from '@/components/ui/can-access'

export function PaymentMethodCreateButton({
  children,
  ...props
}: ResponsiveButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <CanAccess resource="payment_methods" action="create">
      <ResponsiveButton
        icon={Plus}
        tooltip="Nuevo Método de Pago"
        onClick={() => setOpen(true)}
        {...props}
      >
        {children || 'Nuevo'}
      </ResponsiveButton>

      <PaymentMethodCreate open={open} onOpenChange={setOpen} />
    </CanAccess>
  )
}
