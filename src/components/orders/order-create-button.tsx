'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { OrderPosCreate } from './order-pos-create'
import CanAccess from '@/components/ui/can-access'

export function OrderCreateButton({
  children,
  ...props
}: ResponsiveButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <CanAccess resource="orders" action="create">
      <ResponsiveButton
        icon={Plus}
        tooltip="Nueva Orden"
        onClick={() => setOpen(true)}
        {...props}
      >
        {children || 'Nueva'}
      </ResponsiveButton>

      <OrderPosCreate open={open} onOpenChange={setOpen} />
    </CanAccess>
  )
}
