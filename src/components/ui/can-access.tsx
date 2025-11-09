'use client'

import usePerms from '@/hooks/auth/use-perms'
import Forbidden, { ForbiddenProps } from './forbidden'
import { useProfile } from '@/hooks/auth/use-user'

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
  const { isFetched } = useProfile()
  const perm = !!resource && !!action ? `${resource}:${action}` : undefined
  const hasAccess = canAccess(perm)

  if (!isFetched) return null

  if (hasAccess) return children
  return <Forbidden variant={variant}>{children}</Forbidden>
}
