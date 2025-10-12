'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { PetCreate } from './pet-create'

export function PetCreateButton({ children, ...props }: ResponsiveButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton
        icon={Plus}
        tooltip="Nueva Mascota"
        onClick={() => setOpen(true)}
        {...props}
      >
        {children || 'Nuevo'}
      </ResponsiveButton>

      <PetCreate open={open} onOpenChange={setOpen} />
    </>
  )
}
