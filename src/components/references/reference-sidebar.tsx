'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Settings } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/multi-sidebar'
import { cn } from '@/lib/utils'
import { navigationGroups } from './reference-navigation'

export function ReferenceSidebar({
  children,
  onItemClick,
}: {
  children: React.ReactNode
  onItemClick?: () => void
}) {
  const pathname = usePathname()

  return (
    <SidebarProvider id="right" className="items-start relative">
      <SidebarInset>
        {/* Contenido principal */}
        <main className="h-full">{children}</main>
      </SidebarInset>
      <Sidebar
        side="right"
        collapsible="icon"
      >
        <SidebarContent>
          {navigationGroups.map((group) => (
            <SidebarGroup key={group.label} className="">
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(item.href + '/')

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        title={item.title}
                        asChild
                        tooltip={item.tooltip}
                        className={cn(isActive && 'bg-muted')}
                      >
                        <Link href={item.href} onClick={onItemClick}>
                          <Icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2 data-[state=expanded]:bg-sidebar-accent data-[state=expanded]:text-sidebar-accent-foreground">
            <Settings className="h-5 w-5 text-primary" />
            <span className="font-semibold">Referencias</span>
          </div>
        </SidebarHeader>
        
      </Sidebar>
    </SidebarProvider>
  )
}
