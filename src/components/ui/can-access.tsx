'use client'

import usePerms from '@/hooks/auth/use-perms'
import Forbidden, { ForbiddenProps } from './forbidden'

type CanAccessProps = {
  resource?: string
  action?: string
} & ForbiddenProps

export default function CanAccess({
  resource,
  action,
  variant,
  children,
}: CanAccessProps) {
  const { canAccess } = usePerms()
  const perm = !!resource && !!action ? `${resource}:${action}` : undefined
  const hasAccess = canAccess(perm)

  if (hasAccess) return children
  return <Forbidden variant={variant}>{children}</Forbidden>
}
