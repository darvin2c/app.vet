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
    <div className="@container mx-auto flex flex-col gap-4">
      <header className="flex border-b px-4 h-16 shrink-0 items-center justify-between md:gap-16 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        {!isMobile && (
          <div className="flex flex-col items-start justify-center gap-1 ">
            {title && <div className="text-xl font-bold">{title}</div>}
            {subtitle && (
              <div className="text-sm text-muted-foreground hidden lg:block">
                {subtitle}
              </div>
            )}
          </div>
        )}
        <div className="grow">{search}</div>
      </header>
      <div className="grow px-4">{children}</div>
    </div>
  )
}
