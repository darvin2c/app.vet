'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Form } from '@/components/ui/form'
import { Field } from '@/components/ui/field'
import { UserInviteForm } from './user-invite-form'
import {
  invitationSendFormSchema,
  invitationSendFormSchemaType,
} from '@/schemas/invitations.schema'
import useInvitationCreate from '@/hooks/invitations/use-invitation-create'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'
import { sendInvitationsAction } from '@/lib/actions/email/send-invitations'
import { toast } from 'sonner'

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
    const domain = process.env.NEXT_PUBLIC_DOMAIN
    const baseUrl = domain ? `https://${domain}` : ''
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
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="!max-w-2xl">
        <ScrollArea>
          <SheetHeader>
            <SheetTitle>Invitar Usuarios</SheetTitle>
            <SheetDescription>
              Envía invitaciones por correo a usuarios para unirse al tenant.
            </SheetDescription>
          </SheetHeader>

          <Form {...(form as any)}>
            <form onSubmit={onSubmit} className="p-6">
              <UserInviteForm />
            </form>
          </Form>

          <SheetFooter>
            <Field orientation="horizontal">
              <ResponsiveButton
                onClick={onSubmit}
                isLoading={createOne.isPending}
                type="submit"
                variant="default"
              >
                Enviar Invitaciones
              </ResponsiveButton>
              <ResponsiveButton
                onClick={() => setOpen(false)}
                variant="outline"
                isLoading={createOne.isPending}
              >
                Cancelar
              </ResponsiveButton>
            </Field>
          </SheetFooter>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
