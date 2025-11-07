'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'
import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { BreedImport } from './breed-import'

export function BreedImportButton({
  children,
  selectedSpeciesId,
  ...props
}: ResponsiveButtonProps & { selectedSpeciesId?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton
        onClick={() => setOpen(true)}
        variant="outline"
        tooltip="Importar Razas"
        icon={Upload}
        {...props}
      >
        {children || 'Importar'}
      </ResponsiveButton>

      <BreedImport
        open={open}
        onOpenChange={setOpen}
        selectedSpeciesId={selectedSpeciesId}
      />
    </>
  )
}
