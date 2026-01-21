'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { AppointmentTypeCreate } from './appointment-type-create'
import CanAccess from '@/components/ui/can-access'

export function AppointmentTypeCreateButton({
  children,
  ...props
}: ResponsiveButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <CanAccess resource="appointment_types" action="create">
      <ResponsiveButton
        variant="default"
        onClick={() => setOpen(true)}
        {...props}
        icon={Plus}
      >
        {children || 'Nuevo'}
      </ResponsiveButton>

      <AppointmentTypeCreate open={open} onOpenChange={setOpen} />
    </CanAccess>
  )
}
