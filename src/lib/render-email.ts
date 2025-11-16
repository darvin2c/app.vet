import { render } from '@react-email/render'
import InviteEmail from '@/email/templates/invite'

export function renderInviteEmail(props: Parameters<typeof InviteEmail>[0]) {
  return render(InviteEmail(props))
}
