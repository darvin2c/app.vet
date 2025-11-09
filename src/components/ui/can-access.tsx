import usePerms from '@/hooks/auth/use-perms'
import Forbidden, { ForbiddenProps } from './forbidden'

type CanAccessProps = {
  resource: string
  action: string
} & ForbiddenProps

export default function CanAccess({
  resource,
  action,
  variant = 'disabled',
  children,
}: CanAccessProps) {
  const { canAccess } = usePerms()
  const hasAccess = canAccess(`${resource}:${action}`)
  if (hasAccess) return children
  return <Forbidden variant={variant}>{children}</Forbidden>
}
