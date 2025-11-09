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
  const perms = !!resource && !!action ? `${resource}:${action}` : undefined
  const hasAccess = canAccess(perms)

  if (hasAccess) return children

  return <Forbidden variant={variant}>{children}</Forbidden>
}
