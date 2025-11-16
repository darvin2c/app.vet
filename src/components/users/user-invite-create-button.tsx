'use client'

import { ResponsiveButton } from '@/components/ui/responsive-button'
import { useState } from 'react'
import { UserInviteCreate } from './user-invite-create'

export function UserInviteCreateButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <ResponsiveButton onClick={() => setOpen(true)} variant="default">
        Invitar Usuarios
      </ResponsiveButton>
      {open && <UserInviteCreate open={open} onOpenChange={setOpen} />}
    </>
  )
}
