'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { ProductBrandCreate } from './product-brand-create'
import CanAccess from '@/components/ui/can-access'

export function ProductBrandCreateButton({
  children,
  ...props
}: ResponsiveButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <CanAccess resource="product_brands" action="create">
      <ResponsiveButton
        icon={Plus}
        tooltip="Nueva Marca de Producto"
        onClick={() => setOpen(true)}
        {...props}
      >
        {children || 'Nuevo'}
      </ResponsiveButton>

      <ProductBrandCreate open={open} onOpenChange={setOpen} />
    </CanAccess>
  )
}
