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
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from '@/components/ui/sidebar'

interface ReferenceSection {
  title: string
  href: string
  icon: LucideIcon
  description: string
}

const referencesSections: ReferenceSection[] = [
  {
    title: 'Especialidades',
    href: '/references/specialties',
    icon: Stethoscope,
    description: 'Gestionar especialidades médicas',
  },
  {
    title: 'Tipos de Cita',
    href: '/references/appointment-types',
    icon: Calendar,
    description: 'Configurar tipos de citas disponibles',
  },
  {
    title: 'Categorías de Productos',
    href: '/references/product-categories',
    icon: Package,
    description: 'Organizar categorías de productos',
  },
  {
    title: 'Unidades de Productos',
    href: '/references/product-units',
    icon: Ruler,
    description: 'Definir unidades de medida',
  },
]

interface ReferenceSidebarProps {
  onItemClick?: () => void
}

export function ReferenceSidebar({ onItemClick }: ReferenceSidebarProps) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Referencias</h2>
            <p className="text-sm text-muted-foreground">
              Configuración del sistema
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarMenu className="space-y-2">
          {referencesSections.map((section) => {
            const Icon = section.icon
            const isActive =
              pathname === section.href || pathname.startsWith(section.href)

            return (
              <SidebarMenuItem key={section.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={section.description}
                  className="flex items-start gap-3 p-3 h-auto"
                >
                  <Link href={section.href} onClick={onItemClick}>
                    <div className="p-2 rounded-md bg-muted group-hover:bg-muted/80 transition-colors">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-foreground group-hover:text-foreground transition-colors">
                        {section.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {section.description}
                      </div>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
