'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { ProductUnitCreate } from './product-unit-create'
import CanAccess from '@/components/ui/can-access'

export function ProductUnitCreateButton({
  children,
  ...props
}: ResponsiveButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <CanAccess resource="product_units" action="create">
      <ResponsiveButton
        icon={Plus}
        tooltip="Nueva Unidad de Producto"
        onClick={() => setOpen(true)}
        {...props}
      >
        {children || 'Nuevo'}
      </ResponsiveButton>

      <ProductUnitCreate open={open} onOpenChange={setOpen} />
    </CanAccess>
  )
}
