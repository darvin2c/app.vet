'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { StaffCreate } from './staff-create'
import CanAccess from '@/components/ui/can-access'

export function StaffCreateButton({
  children,
  ...props
}: ResponsiveButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <CanAccess resource="staff" action="create">
      <ResponsiveButton
        icon={Plus}
        tooltip="Nuevo Staff"
        onClick={() => setOpen(true)}
        {...props}
      >
        {children || 'Nuevo'}
      </ResponsiveButton>

      <StaffCreate open={open} onOpenChange={setOpen} />
    </CanAccess>
  )
}
