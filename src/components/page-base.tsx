'use client'

import { Fragment } from 'react'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { SidebarTrigger, useSidebar } from './ui/multi-sidebar'
import { Separator } from './ui/separator'
import { useIsMobile } from '@/hooks/use-mobile'

export interface BreadcrumbLinkItem {
  label: React.ReactNode
  href?: string
}

const PageBaseContent = ({
  children,
  search,
  breadcrumbs,
  actions,
}: {
  children: React.ReactNode
  search?: React.ReactNode
  breadcrumbs?: BreadcrumbLinkItem[]
  actions?: React.ReactNode
}) => {
  const isMobile = useIsMobile()
  const { isMounted: isRightSidebarMounted } = useSidebar('right')

  return (
    <div className="@container mx-auto flex flex-col gap-4">
      <header className="flex border-b gap-3 px-4 h-16 shrink-0 items-center transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <SidebarTrigger sidebarId="left" className="cursor-ew-resize" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        {isMobile && (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs &&
                breadcrumbs.length > 0 &&
                breadcrumbs.map((item, index) => (
                  <Fragment key={index}>
                    <BreadcrumbItem className="hidden md:block">
                      {item.href && index < breadcrumbs.length - 1 ? (
                        <BreadcrumbLink href={item.href}>
                          {item.label}
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && (
                      <BreadcrumbSeparator className="hidden md:block" />
                    )}
                  </Fragment>
                ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
        <div className="grow flex items-center justify-end gap-2">
          <div className="max-w-xl !w-full">{search}</div>
          <div className="flex items-center gap-2">{actions}</div>
        </div>
        {isRightSidebarMounted && (
          <>
            <Separator orientation="vertical" className="mr-2 h-4" />
            <SidebarTrigger sidebarId="right" className="cursor-ew-resize" />
          </>
        )}
      </header>
      <div className="grow">{children}</div>
    </div>
  )
}

export default function PageBase(props: any) {
  return <PageBaseContent {...props} />
}
