'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'
import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { ProductImport } from './product-import'

export function ProductImportButton({
  children,
  ...props
}: ResponsiveButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton
        onClick={() => setOpen(true)}
        variant="outline"
        size="sm"
        tooltip="Importar Productos"
        icon={Upload}
        {...props}
      >
        <span className="hidden sm:inline">{children || 'Importar'}</span>
      </ResponsiveButton>

      <ProductImport open={open} onOpenChange={setOpen} />
    </>
  )
}
