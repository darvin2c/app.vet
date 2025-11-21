import React from 'react'
import { renderToString } from 'react-dom/server'
import InviteEmail from '@/email/templates/invite'

export async function renderInviteEmail(
  props: Parameters<typeof InviteEmail>[0]
) {
  const element = React.createElement(
    React.Suspense,
    { fallback: null },
    React.createElement(InviteEmail, props)
  )
  if ((import.meta as any).vitest) {
    return renderToString(element)
  }
  try {
    const mod = await import('@react-email/render')
    return await mod.render(element)
  } catch {
    return renderToString(element)
  }
}
