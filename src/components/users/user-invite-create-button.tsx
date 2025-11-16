'use client'

import { ResponsiveButton } from '@/components/ui/responsive-button'
import { useState } from 'react'
import { UserInviteCreate } from './user-invite-create'

type SendAction = (params: {
  invites: Array<{
    id: string
    email: string
    roleName: string
    expiresAt: string
    acceptUrl: string
    message?: string
    company: string
  }>
  subject?: string
}) => Promise<any>

export function UserInviteCreateButton({ onSend }: { onSend: SendAction }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <ResponsiveButton onClick={() => setOpen(true)} variant="default">
        Invitar Usuarios
      </ResponsiveButton>
      {open && (
        <UserInviteCreate open={open} onOpenChange={setOpen} onSend={onSend} />
      )}
    </>
  )
}
