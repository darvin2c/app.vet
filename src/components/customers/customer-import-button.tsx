'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'
import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { CustomerImport } from './customer-import'

export function CustomerImportButton({
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
        tooltip="Importar Clientes"
        {...props}
        icon={Upload}
      >
        <span className="hidden sm:inline">{children || 'Importar'}</span>
      </ResponsiveButton>

      <CustomerImport open={open} onOpenChange={setOpen} />
    </>
  )
}
