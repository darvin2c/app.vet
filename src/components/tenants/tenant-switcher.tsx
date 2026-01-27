'use client'

import { ChevronsUpDown, Plus } from 'lucide-react'
import Link from 'next/link'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/multi-sidebar'
import useTenants from '@/hooks/tenants/use-tenants'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { useGoTenant } from '@/hooks/tenants/use-go-tenant'

export function TenantSwitcher() {
  const { isMobile, state } = useSidebar()
  const { urlTenant } = useGoTenant()
  const { data: tenants } = useTenants()
  const { currentTenant } = useCurrentTenantStore()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                {currentTenant ? (
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                      {currentTenant.name?.[0] || 'T'}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Plus className="size-4" />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {currentTenant ? currentTenant.name : 'Seleccionar Tenant'}
                </span>
                <span className="truncate text-xs">
                  {currentTenant ? 'Tenant Actual' : 'Sin seleccionar'}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Tenants
            </DropdownMenuLabel>
            {tenants?.map((tenant) => (
              <Link key={tenant.id} href={urlTenant(tenant)}>
                <DropdownMenuItem className="gap-2 p-2">
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    <Avatar>
                      <AvatarFallback>{tenant.name?.[0] || ''}</AvatarFallback>
                    </Avatar>
                  </div>
                  {tenant.name}
                </DropdownMenuItem>
              </Link>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">
                Ir a la cuenta
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
