import { describe, it, expect } from 'vitest'
import { invitationCreateSchema } from '@/schemas/invitations.schema'

describe('invitationCreateSchema', () => {
  it('validates multiple emails and required fields', () => {
    const data = {
      emails: ['a@example.com', 'b@example.com'],
      role_id: 'role-1',
      expires_at: new Date().toISOString(),
      message: 'Hola',
    }
    const parsed = invitationCreateSchema.safeParse(data)
    expect(parsed.success).toBe(true)
  })

  it('fails when emails is empty', () => {
    const parsed = invitationCreateSchema.safeParse({
      emails: [],
      role_id: 'x',
      expires_at: new Date().toISOString(),
    })
    expect(parsed.success).toBe(false)
  })
})

