'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarRail,
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
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  )
}
