'use client'

import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { useState } from 'react'
import { UserInviteCreate } from './user-invite-create'

export function UserInviteCreateButton({
  children,
  ...props
}: ResponsiveButtonProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <ResponsiveButton
        onClick={() => setOpen(true)}
        variant="ghost"
        {...props}
      >
        {children || 'Invitar Usuarios'}
      </ResponsiveButton>
      {open && <UserInviteCreate open={open} onOpenChange={setOpen} />}
    </>
  )
}
