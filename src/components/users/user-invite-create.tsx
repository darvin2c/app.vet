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
import { invitationSendFormSchema } from '@/schemas/invitations.schema'
import useInvitationCreateBulk from '@/hooks/invitations/use-invitation-create-bulk'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'
import { toast } from 'sonner'

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
  const createBulk = useInvitationCreateBulk()
  const { currentTenant } = useCurrentTenantStore()

  const form = useForm({
    resolver: zodResolver(invitationSendFormSchema),
    defaultValues: {
      emailsText: '',
      role_id: '',
      expires_at: new Date().toISOString(),
      message: '',
    } as any,
  })

  const onSubmit = form.handleSubmit(async (values: any) => {
    const emails = (values.emailsText as string)
      .split('\n')
      .map((e) => e.trim())
      .filter(Boolean)
    const payload = emails.map((email: string) => ({
      email,
      role_id: values.role_id,
      expires_at: values.expires_at,
      message: values.message,
    }))

    const invites = await createBulk.mutateAsync(payload)

    const domain = process.env.NEXT_PUBLIC_DOMAIN
    const baseUrl = domain ? `https://${domain}` : ''

    toast.success('Invitaciones enviadas')
    form.reset()
    setOpen(false)
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
            <form onSubmit={onSubmit} className="px-4">
              <UserInviteForm />
            </form>
          </Form>

          <SheetFooter>
            <Field orientation="horizontal">
              <ResponsiveButton
                onClick={onSubmit}
                isLoading={createBulk.isPending}
                type="submit"
                variant="default"
              >
                Enviar Invitaciones
              </ResponsiveButton>
              <ResponsiveButton
                onClick={() => setOpen(false)}
                variant="outline"
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
