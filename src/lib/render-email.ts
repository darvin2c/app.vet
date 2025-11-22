import React from 'react'
import InviteEmail from '@/email/templates/invite'
import AppointmentWrapperEmail from '@/email/templates/appointment-wrapper'
import { render } from '@react-email/render'

export async function renderInviteEmail(
  props: Parameters<typeof InviteEmail>[0]
) {
  const element = React.createElement(
    React.Suspense,
    { fallback: null },
    React.createElement(InviteEmail, props)
  )
  return render(element)
}

export async function renderAppointmentEmailWrapper(
  props: Parameters<typeof AppointmentWrapperEmail>[0]
) {
  const element = React.createElement(
    React.Suspense,
    { fallback: null },
    React.createElement(AppointmentWrapperEmail, props)
  )
  return render(element)
}
