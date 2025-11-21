import { describe, it, expect } from 'vitest'
import { renderInviteEmail } from '@/lib/render-email'

describe('renderInviteEmail', () => {
  it('renders HTML with recipient and link', async () => {
    const html = await renderInviteEmail({
      company: 'Acme',
      recipientEmail: 'user@example.com',
      roleName: 'ADMIN',
      expiresAt: new Date().toISOString(),
      acceptUrl: 'https://example.com/accept?token=abc',
      message: 'Bienvenido',
    })
    expect(html).toContain('user@example.com')
    expect(html).toContain('https://example.com/accept?token=abc')
  })
})
