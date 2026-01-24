'use client'

import { Fragment } from 'react'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "./ui/multi-sidebar"
import { Separator } from "./ui/separator"

export interface BreadcrumbLinkItem {
  label: React.ReactNode
  href?: string
}

export default function PageBase({
  children,
  title,
  search,
  breadcrumbs,
  actions,
}: {
  children: React.ReactNode
  title?: React.ReactNode
  subtitle?: React.ReactNode
  search?: React.ReactNode
  breadcrumbs?: BreadcrumbLinkItem[]
  actions?: React.ReactNode
}) {
  return (
    <div className="@container mx-auto flex flex-col gap-4">
      <header className="flex border-b gap-3 px-4 h-16 shrink-0 items-center justify-between transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <SidebarTrigger sidebarId="left"
            className="cursor-ew-resize" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs && breadcrumbs.length > 0 ? (
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
                ))
              ) : (
                <BreadcrumbItem>
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                </BreadcrumbItem>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        <div className="grow">{search}</div>
        <div className="flex items-center gap-2">{actions}</div>
      </header>
      <div className="grow px-4">{children}</div>
    </div>
  )
}
