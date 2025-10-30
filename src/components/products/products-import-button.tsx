'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'
import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { ProductsImport } from './products-import'

export function ProductsImportButton({
  children,
  ...props
}: ResponsiveButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton
        icon={Upload}
        tooltip="Importar Productos"
        onClick={() => setOpen(true)}
        {...props}
      >
        {children || 'Importar'}
      </ResponsiveButton>

      <ProductsImport open={open} onOpenChange={setOpen} />
    </>
  )
}
