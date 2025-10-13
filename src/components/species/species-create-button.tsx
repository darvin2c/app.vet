'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { SpeciesCreate } from './species-create'

export function SpeciesCreateButton({
  children,
  ...props
}: ResponsiveButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton
        icon={Plus}
        tooltip="Nueva Especie"
        onClick={() => setOpen(true)}
        {...props}
      >
        {children || 'Nuevo'}
      </ResponsiveButton>

      <SpeciesCreate
        open={open}
        onOpenChange={setOpen}
        onSuccess={() => setOpen(false)}
      />
    </>
  )
}
