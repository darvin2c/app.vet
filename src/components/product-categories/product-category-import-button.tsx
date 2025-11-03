'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'
import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { ProductCategoryImport } from './product-category-import'

export function ProductCategoryImportButton({
  children,
  ...props
}: ResponsiveButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton
        icon={Upload}
        tooltip="Importar Categorías"
        onClick={() => setOpen(true)}
        variant="outline"
        {...props}
      >
        {children || 'Importar'}
      </ResponsiveButton>

      <ProductCategoryImport open={open} onOpenChange={setOpen} />
    </>
  )
}