'use client'

import {
  User,
  Box,
  Calendar,
  Boxes,
  ListCollapse,
  LucideIcon,
  PawPrint,
  Handshake,
  Scale,
  ShieldCheck,
  BadgeDollarSign,
  Stethoscope,
} from 'lucide-react'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar-left'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { DashboardIcon } from '../icons'

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
        title: 'dashboard',
        href: '/',
        icon: DashboardIcon,
        tooltip: 'Dashboard',
      },
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
        title: 'Ordenes',
        href: '/orders',
        icon: Scale,
        tooltip: 'Ordenes',
      },
      {
        title: 'Pagos',
        href: '/payments',
        icon: BadgeDollarSign,
        tooltip: 'Pagos',
      },
      {
        title: 'Productos',
        href: '/products',
        icon: Box,
        tooltip: 'Productos',
      },
      {
        title: 'Servicios',
        href: '/services',
        icon: Stethoscope,
        tooltip: 'Servicios',
      },
      {
        title: 'Kardex',
        href: '/kardex',
        icon: Boxes,
        tooltip: 'Kardex',
      },
      {
        title: 'Proveedores',
        href: '/suppliers',
        icon: Handshake,
        tooltip: 'Proveedores',
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
      {
        title: 'Configuración',
        href: '/settings',
        icon: Box,
        tooltip: 'Configuración',
      },
    ],
  },
  {
    label: 'Seguridad',
    items: [
      {
        title: 'Usuarios',
        href: '/users',
        icon: User,
        tooltip: 'Usuarios',
      },
      {
        title: 'Roles',
        href: '/roles',
        icon: ShieldCheck,
        tooltip: 'Roles',
      },
    ],
  },
]

export function MainNav() {
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
