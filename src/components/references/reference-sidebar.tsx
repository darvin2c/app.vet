'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Stethoscope,
  Calendar,
  Package,
  Ruler,
  Settings,
  LucideIcon,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar'
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

// Estructura de datos organizada para la navegación de referencias
const navigationGroups: NavGroup[] = [
  {
    label: 'Referencias del Sistema',
    items: [
      {
        title: 'Especialidades',
        href: '/references/specialties',
        icon: Stethoscope,
        tooltip: 'Gestionar especialidades médicas',
      },
      {
        title: 'Tipos de Cita',
        href: '/references/appointment-types',
        icon: Calendar,
        tooltip: 'Configurar tipos de citas disponibles',
      },
      {
        title: 'Categorías de Productos',
        href: '/references/product-categories',
        icon: Package,
        tooltip: 'Organizar categorías de productos',
      },
      {
        title: 'Unidades de Productos',
        href: '/references/product-units',
        icon: Ruler,
        tooltip: 'Definir unidades de medida',
      },
    ],
  },
]

interface ReferenceSidebarProps {
  onItemClick?: () => void
}

export function ReferenceSidebar({ onItemClick }: ReferenceSidebarProps) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="absolute">
      <SidebarHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2 data-[state=expanded]:bg-sidebar-accent data-[state=expanded]:text-sidebar-accent-foreground">
          <Settings className="h-5 w-5 text-primary" />
          <span className="font-semibold">Referencias</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
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
    </Sidebar>
  )
}
