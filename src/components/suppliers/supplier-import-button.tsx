'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'
import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { SupplierImport } from './supplier-import'

export function SupplierImportButton({
  children,
  ...props
}: ResponsiveButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton
        onClick={() => setOpen(true)}
        icon={Upload}
        tooltip="Importar proveedores"
        {...props}
      >
        {children || 'Importar'}
      </ResponsiveButton>
      <SupplierImport open={open} onOpenChange={setOpen} />
    </>
  )
}
