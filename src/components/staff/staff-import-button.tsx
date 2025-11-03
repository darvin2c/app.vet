'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'
import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { StaffImport } from './staff-import'

export function StaffImportButton({
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
        tooltip="Importar Personal"
        icon={Upload}
        {...props}
      >
        <span className="hidden sm:inline">{children || 'Importar'}</span>
      </ResponsiveButton>

      <StaffImport open={open} onOpenChange={setOpen} />
    </>
  )
}