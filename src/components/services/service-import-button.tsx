'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'
import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { ServiceImport } from './service-import'

export function ServiceImportButton({
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
        tooltip="Importar Servicios"
        icon={Upload}
        {...props}
      >
        <span className="hidden sm:inline">{children || 'Importar'}</span>
      </ResponsiveButton>

      <ServiceImport open={open} onOpenChange={setOpen} />
    </>
  )
}
