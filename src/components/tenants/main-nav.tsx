'use client'

import {
  User,
  Box,
  Calendar,
  Boxes,
  ListCollapse,
  LucideIcon,
  PawPrint,
} from 'lucide-react'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  tooltip: string
}

interface NavGroup {
  label: string
  items: NavItem[]
}

// Estructura de datos organizada para la navegación
const navigationGroups: NavGroup[] = [
  {
    label: 'Clínica',
    items: [
      {
        title: 'Agenda',
        href: '/agenda',
        icon: Calendar,
        tooltip: 'Agenda',
      },
      {
        title: 'Clientes',
        href: '/customers',
        icon: User,
        tooltip: 'Clientes',
      },
      {
        title: 'Mascotas',
        href: '/pets',
        icon: PawPrint,
        tooltip: 'Mascotas',
      },
    ],
  },
  {
    label: 'Ventas',
    items: [
      {
        title: 'Productos',
        href: '/products',
        icon: Box,
        tooltip: 'Productos',
      },
      {
        title: 'Kardex',
        href: '/kardex',
        icon: Boxes,
        tooltip: 'Kardex',
      },
    ],
  },
  {
    label: 'Configuración',
    items: [
      {
        title: 'Referencias',
        href: '/references',
        icon: ListCollapse,
        tooltip: 'Referencias',
      },
    ],
  },
]

export function MainNav() {
  const { isMobile } = useSidebar()
  const pathname = usePathname()

  return (
    <>
      {navigationGroups.map((group) => (
        <SidebarGroup key={group.label} className="">
          <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
          <SidebarMenu>
            {group.items.map((item) => {
              const Icon = item.icon
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + '/')

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    title={item.title}
                    asChild
                    tooltip={item.tooltip}
                    className={cn(isActive && 'bg-muted')}
                  >
                    <Link href={item.href}>
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
    </>
  )
}
