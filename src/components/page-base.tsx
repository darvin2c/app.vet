'use client'

import { useIsMobile } from '@/hooks/use-mobile'

export default function PageBase({
  children,
  title,
  subtitle,
  search,
}: {
  children: React.ReactNode
  title?: React.ReactNode
  subtitle?: React.ReactNode
  search?: React.ReactNode
}) {
  const isMobile = useIsMobile()
  return (
    <div className="@container mx-auto px-4 flex flex-col gap-4">
      <header className="flex h-16 shrink-0 items-center justify-between md:gap-16 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        {!isMobile && (
          <div className="flex flex-col items-start justify-center gap-1 ">
            {title && (
              <div className="text-xl font-bold md:text-2xl">{title}</div>
            )}
            {subtitle && (
              <div className="text-sm text-muted-foreground hidden lg:block">
                {subtitle}
              </div>
            )}
          </div>
        )}
        <div className="grow">{search}</div>
      </header>
      {children}
    </div>
  )
}
