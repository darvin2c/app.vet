'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Stethoscope,
  Calendar,
  Activity,
  Package,
  Ruler,
  Menu,
  Settings,
  X,
} from 'lucide-react'

const referencesSections = [
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

function SidebarContent({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="p-6 border-b">
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
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {referencesSections.map((section) => {
            const Icon = section.icon
            const isActive =
              pathname === section.href || pathname.startsWith(section.href)

            return (
              <Link
                key={section.href}
                href={section.href}
                onClick={onItemClick}
              >
                <div
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-muted/50 cursor-pointer group',
                    isActive && 'bg-muted'
                  )}
                >
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
                </div>
              </Link>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}

function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <div className="lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <SheetTitle className="sr-only">
            Menú de navegación de referencias
          </SheetTitle>
          <SidebarContent onItemClick={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default function ReferencesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header móvil */}
      <div className="lg:hidden border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <MobileNav />
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              <h1 className="font-semibold">Referencias</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar para desktop */}
        <div className="hidden lg:flex lg:w-72 lg:flex-col lg:border-r lg:bg-muted/30">
          <SidebarContent />
        </div>

        {/* Contenido principal */}
        <div className="flex-1 min-w-0">
          <main className="h-full">{children}</main>
        </div>
      </div>
    </div>
  )
}
