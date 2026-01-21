'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { SpecialtyCreate } from './specialty-create'
import CanAccess from '@/components/ui/can-access'

export function SpecialtyCreateButton({
  children,
  ...props
}: ResponsiveButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <CanAccess resource="specialties" action="create">
      <ResponsiveButton
        icon={Plus}
        tooltip="Nueva Especialidad"
        onClick={() => setOpen(true)}
        {...props}
      >
        {children || 'Nuevo'}
      </ResponsiveButton>

      <SpecialtyCreate open={open} onOpenChange={setOpen} />
    </CanAccess>
  )
}
