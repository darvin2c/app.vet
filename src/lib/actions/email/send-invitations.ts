'use server'

import { renderInviteEmail } from '@/lib/render-email'
import { sendEmail } from '@/lib/smtp'
import { createClient } from '@/lib/supabase/server'

export async function sendInvitationsAction(params: {
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
}) {
  const supabase = await createClient()
  const subject = params.subject || 'Invitación'
  const html =
    params.invites.length > 0
      ? await renderInviteEmail({
          company: params.invites[0].company,
          recipientEmail: params.invites[0].email,
          roleName: params.invites[0].roleName,
          expiresAt: params.invites[0].expiresAt,
          acceptUrl: params.invites[0].acceptUrl,
          message: params.invites[0].message,
        })
      : ''

  const result = await sendEmail({
    to: params.invites.map((i) => i.email),
    subject,
    html,
  })

  const now = new Date().toISOString()
  await Promise.all(
    params.invites.map((i) =>
      supabase
        .from('invitations')
        .update({
          metadata: {
            last_send_at: now,
            last_send_status: 'success',
          },
        })
        .eq('id', i.id)
    )
  )

  return { ok: true, messageId: (result as any).messageId }
}
