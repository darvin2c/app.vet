'use client'

import * as React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/multi-sidebar'
import { TenantSwitcher } from '../tenants/tenant-switcher'
import { UserNav } from '../auth/user-nav'
import { MainNav } from './main-nav'
import TenantIsInactive from '../settings/tenant-is-inactive'
export function AppSidebar({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider id="left">
      <Sidebar collapsible="icon">
        <SidebarHeader className="flex flex-row items-center justify-between">
          <TenantSwitcher />
          <SidebarTrigger sidebarId="left" className="-ml-1 cursor-ew-resize" />
        </SidebarHeader>
        <SidebarContent>
          <MainNav />
        </SidebarContent>
        <SidebarFooter>
          <UserNav />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <TenantIsInactive />
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
