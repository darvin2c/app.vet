'use client'

import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { useState } from 'react'
import { UserInviteCreate } from './user-invite-create'
import CanAccess from '@/components/ui/can-access'

export function UserInviteCreateButton({
  children,
  ...props
}: ResponsiveButtonProps) {
  const [open, setOpen] = useState(false)
  return (
    <CanAccess resource="users" action="create">
      <ResponsiveButton
        onClick={() => setOpen(true)}
        variant="ghost"
        {...props}
      >
        {children || 'Invitar Usuarios'}
      </ResponsiveButton>
      {open && <UserInviteCreate open={open} onOpenChange={setOpen} />}
    </CanAccess>
  )
}
