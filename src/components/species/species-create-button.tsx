'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { SpeciesCreate } from './species-create'
import CanAccess from '@/components/ui/can-access'

export function SpeciesCreateButton({
  children,
  ...props
}: ResponsiveButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <CanAccess resource="species" action="create">
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
    </CanAccess>
  )
}
