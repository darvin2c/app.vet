'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'
import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { ProductBrandImport } from './product-brand-import'

export function ProductBrandImportButton({
  children,
  ...props
}: ResponsiveButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton
        icon={Upload}
        tooltip="Importar Marcas"
        onClick={() => setOpen(true)}
        variant="outline"
        {...props}
      >
        {children || 'Importar'}
      </ResponsiveButton>

      <ProductBrandImport open={open} onOpenChange={setOpen} />
    </>
  )
}
