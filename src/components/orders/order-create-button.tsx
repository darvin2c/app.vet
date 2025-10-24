'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { OrderCreate } from './order-create'

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

      <OrderCreate open={open} onOpenChange={setOpen} />
    </>
  )
}
