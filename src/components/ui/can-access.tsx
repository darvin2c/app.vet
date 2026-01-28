'use client'

import usePerms from '@/hooks/auth/use-perms'
import Forbidden, { ForbiddenProps } from './forbidden'

export type CanAccessProps = {
  resource?: string
  action?: string
}

export default function CanAccess({
  resource,
  action,
  variant,
  children,
}: CanAccessProps & ForbiddenProps) {
  const { canAccess } = usePerms()
  const perm = !!resource && !!action ? `${resource}:${action}` : undefined
  const hasAccess = canAccess(perm)

  if (hasAccess) return children
  return <Forbidden variant={variant}>{children}</Forbidden>
}
