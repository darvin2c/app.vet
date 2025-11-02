'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'
import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { PetImport } from './pet-import'

export function PetImportButton({ children, ...props }: ResponsiveButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton
        onClick={() => setOpen(true)}
        icon={Upload}
        tooltip="Importar mascotas"
        {...props}
      >
        {children || 'Importar'}
      </ResponsiveButton>
      <PetImport open={open} onOpenChange={setOpen} />
    </>
  )
}
