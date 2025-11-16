import { describe, it, expect } from 'vitest'
import { invitationSendFormSchema } from '@/schemas/invitations.schema'

describe('invitationSendFormSchema', () => {
  it('valida un email y campos requeridos', () => {
    const data = {
      email: 'a@example.com',
      role_id: 'role-1',
      expires_at: new Date().toISOString(),
      message: 'Hola',
    }
    const parsed = invitationSendFormSchema.safeParse(data)
    expect(parsed.success).toBe(true)
  })

  it('falla cuando el email es inválido', () => {
    const parsed = invitationSendFormSchema.safeParse({
      email: 'no-email',
      role_id: 'x',
    })
    expect(parsed.success).toBe(false)
  })
})
