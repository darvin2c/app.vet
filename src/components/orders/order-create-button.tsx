'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { OrderPosCreate } from './order-pos-create'

export function OrderCreateButton({
  children,
  ...props
}: ResponsiveButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton
        icon={Plus}
        tooltip="Nueva Orden"
        onClick={() => setOpen(true)}
        {...props}
      >
        {children || 'Nueva Orden'}
      </ResponsiveButton>

      <OrderPosCreate open={open} onOpenChange={setOpen} />
    </>
  )
}
