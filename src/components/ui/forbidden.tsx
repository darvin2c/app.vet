'use client'

import { CircleOff } from 'lucide-react'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from './empty'
import React, {
  ReactNode,
  cloneElement,
  isValidElement,
  ReactElement,
  JSX,
} from 'react'
import { cn } from '@/lib/utils'

const ForbiddenPage = () => (
  <Empty>
    <EmptyHeader>
      <EmptyMedia>
        <CircleOff />
      </EmptyMedia>
      <EmptyTitle>403 - Prohibido</EmptyTitle>
      <EmptyDescription>
        No tienes permisos para acceder a esta página.
      </EmptyDescription>
    </EmptyHeader>
  </Empty>
)

export const ForbiddenDisabled = ({ children }: { children?: ReactNode }) => {
  if (!children) return null
  if (!isValidElement(children)) return null

  return cloneElement<any>(children, {
    disabled: true,
    onClick: undefined,
    onChange: undefined,
    'aria-disabled': true,
    tabIndex: -1,
  })
}

export type ForbiddenProps = {
  variant?: 'page' | 'disabled'
  children?: ReactNode
}

export default function Forbidden({
  variant = 'page',
  children,
}: ForbiddenProps) {
  return (
    <>
      {variant === 'page' && <ForbiddenPage />}
      {variant === 'disabled' && (
        <ForbiddenDisabled>{children}</ForbiddenDisabled>
      )}
    </>
  )
}
