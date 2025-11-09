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
} from '@/components/ui/sidebar-left'
import { TenantSwitcher } from '../tenants/tenant-switcher'
import { UserNav } from '../auth/user-nav'
import { MainNav } from './main-nav'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'
import TenantIsInactiveModal from '../settings/tenant-is-inactive'
export function AppSidebar({ children }: { children: React.ReactNode }) {
  const { currentTenant } = useCurrentTenantStore()
  return (
    <SidebarProvider>
      <TenantIsInactiveModal />
      <Sidebar collapsible="icon">
        <SidebarHeader className="flex flex-row items-center justify-between">
          <TenantSwitcher />
          <SidebarTrigger className="-ml-1 cursor-ew-resize" />
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
        <div>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
