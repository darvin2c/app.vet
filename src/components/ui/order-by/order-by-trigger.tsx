'use client'

import React from 'react'
import { ArrowUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'

export const OrderByTrigger = React.forwardRef<
  HTMLButtonElement,
  {
    activeSortsCount: number
    className?: string
  } & ResponsiveButtonProps
>(({ activeSortsCount, className, ...props }, ref) => {
  const isMobile = useIsMobile()
  return (
    <ResponsiveButton
      ref={ref}
      variant="outline"
      className={cn('border-dashed relative', className)}
      icon={ArrowUpDown}
      {...props}
    >
      {isMobile ? '' : 'Ordenar'}
      {activeSortsCount > 0 && (
        <Badge variant="secondary" className="absolute -top-2 -right-2 text-xs">
          {activeSortsCount}
        </Badge>
      )}
    </ResponsiveButton>
  )
})

OrderByTrigger.displayName = 'OrderByTrigger'
