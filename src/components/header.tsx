'use client'

import { useIsMobile } from '@/hooks/use-mobile'
import { SidebarTrigger } from './ui/sidebar'

export default function Header({
  title,
  subtitle,
  actions,
  search,
}: {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  actions?: React.ReactNode
  search?: React.ReactNode
}) {
  const isMobile = useIsMobile()

  return (
    <header className="flex h-16 shrink-0 items-center justify-between md:gap-16 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      {!isMobile && (
        <div className="flex flex-col items-start justify-center gap-1 ">
          {title && (
            <div className="text-xl font-bold md:text-2xl">{title}</div>
          )}
          {subtitle && (
            <div className="text-sm text-muted-foreground">{subtitle}</div>
          )}
        </div>
      )}
      <div className="flex items-center gap-4 grow">
        <div className="grow">{search}</div>
        {actions && <div className="flex-shrink-0">{actions}</div>}
      </div>
    </header>
  )
}
