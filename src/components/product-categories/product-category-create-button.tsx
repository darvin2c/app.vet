'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { ProductCategoryCreate } from './product-category-create'
import CanAccess from '@/components/ui/can-access'

export function ProductCategoryCreateButton({
  children,
  ...props
}: ResponsiveButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <CanAccess resource="product_categories" action="create">
      <ResponsiveButton
        icon={Plus}
        tooltip="Nueva Categoría"
        onClick={() => setOpen(true)}
        {...props}
      >
        {children || 'Nuevo'}
      </ResponsiveButton>

      <ProductCategoryCreate open={open} onOpenChange={setOpen} />
    </CanAccess>
  )
}
