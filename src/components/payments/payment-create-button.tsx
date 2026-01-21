'use client'

import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { PaymentCreate } from './payment-create'
import CanAccess from '@/components/ui/can-access'

export function PaymentCreateButton({
  children,
  ...props
}: ResponsiveButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <CanAccess resource="payments" action="create">
      <ResponsiveButton
        icon={Plus}
        onClick={() => setOpen(true)}
        tooltip="Crear Nuevo Pago"
        {...props}
      >
        {children || 'Nuevo'}
      </ResponsiveButton>
      <PaymentCreate open={open} onOpenChange={setOpen} />
    </CanAccess>
  )
}
