'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'
import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { AppointmentTypeImport } from './appointment-type-import'

export function AppointmentTypeImportButton({
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
        tooltip="Importar Tipos de Cita"
        icon={Upload}
        {...props}
      >
        <span className="hidden sm:inline">{children || 'Importar'}</span>
      </ResponsiveButton>

      <AppointmentTypeImport open={open} onOpenChange={setOpen} />
    </>
  )
}
