'use client'

import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { ProductMovementCreate } from './product-movement-create'

export function ProductMovementCreateButton({
  children,
  ...props
}: ResponsiveButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton
        icon={Plus}
        onClick={() => setOpen(true)}
        tooltip="Crear Nuevo Movimiento"
        {...props}
      >
        {children || 'Nuevo'}
      </ResponsiveButton>
      <ProductMovementCreate open={open} onOpenChange={setOpen} />
    </>
  )
}
