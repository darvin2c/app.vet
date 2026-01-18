'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormSheet } from '@/components/ui/form-sheet'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { Field } from '@/components/ui/field'
import { UserInviteForm } from './user-invite-form'
import {
  invitationSendFormSchema,
  invitationSendFormSchemaType,
} from '@/schemas/invitations.schema'
import useInvitationCreate from '@/hooks/invitations/use-invitation-create'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'
import { sendInvitationsAction } from '@/lib/actions/email/send-invitations'
import CanAccess from '@/components/ui/can-access'

interface UserInviteCreateProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function UserInviteCreate({
  open,
  onOpenChange,
}: UserInviteCreateProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = open !== undefined ? open : internalOpen
  const setOpen = onOpenChange || setInternalOpen
  const createOne = useInvitationCreate()
  const { currentTenant } = useCurrentTenantStore()

  const form = useForm<invitationSendFormSchemaType>({
    resolver: zodResolver(invitationSendFormSchema),
    defaultValues: {
      email: '',
      role_id: '',
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    const invite = await createOne.mutateAsync({
      email: data.email,
      role_id: data.role_id,
      // now + 7 days
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    })
    form.reset()
    setOpen(false)
    const authUrl = process.env.NEXT_AUTH_URL
    const baseUrl = authUrl ? `${authUrl}` : ''
    await sendInvitationsAction({
      invites: [
        {
          id: invite.id,
          email: invite.email,
          roleName: invite.role_id,
          expiresAt: invite.expires_at,
          acceptUrl: `${baseUrl}/accept-invitation?token=${invite.token}`,
          message:
            typeof invite.metadata === 'object' && invite.metadata
              ? (invite.metadata as any).message
              : undefined,
          company: currentTenant?.name || 'Mi Empresa',
        },
      ],
      subject: `Invitación a la plataforma - ${currentTenant?.name || 'Mi Empresa'}`,
    })
  })

  return (
    <CanAccess resource="products" action="create">
      <FormSheet
        open={isOpen}
        onOpenChange={setOpen as any}
        title="Invitar Usuarios"
        description="Envía invitaciones por correo a usuarios para unirse al tenant."
        form={form as any}
        onSubmit={onSubmit as any}
        isPending={createOne.isPending}
        submitLabel="Enviar Invitaciones"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-2xl"
      >
        <div className="p-6">
          <UserInviteForm />
          <Field orientation="horizontal" />
        </div>
      </FormSheet>
    </CanAccess>
  )
}
