'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'
import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { ProductUnitImport } from './product-unit-import'

export function ProductUnitImportButton({
  children,
  ...props
}: ResponsiveButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton
        icon={Upload}
        tooltip="Importar Unidades"
        onClick={() => setOpen(true)}
        variant="outline"
        {...props}
      >
        {children || 'Importar'}
      </ResponsiveButton>

      <ProductUnitImport open={open} onOpenChange={setOpen} />
    </>
  )
}
