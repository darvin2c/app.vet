'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { ProductCreate } from './product-create'
import CanAccess from '@/components/ui/can-access'

export function ProductCreateButton({
  children,
  ...props
}: ResponsiveButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <CanAccess resource="products" action="create">
      <ResponsiveButton
        icon={Plus}
        tooltip="Nuevo Producto"
        onClick={() => setOpen(true)}
        {...props}
      >
        {children || 'Nuevo'}
      </ResponsiveButton>
      <ProductCreate open={open} onOpenChange={setOpen} />
    </CanAccess>
  )
}
