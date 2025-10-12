'use client'

import { ReactNode } from 'react'
import { useParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { User, Calendar, Stethoscope, FileText, Paperclip } from 'lucide-react'

interface PatientLayoutProps {
  children: ReactNode
}

const navigationItems = [
  {
    id: 'overview',
    label: 'Resumen',
    href: '',
    icon: User,
  },
  {
    id: 'appointments',
    label: 'Citas',
    href: '/appointments',
    icon: Calendar,
  },
  {
    id: 'treatments',
    label: 'Tratamientos',
    href: '/treatments',
    icon: Stethoscope,
  },
  {
    id: 'notes',
    label: 'Notas Clínicas',
    href: '/notes',
    icon: FileText,
  },
  {
    id: 'attachments',
    label: 'Adjuntos',
    href: '/attachments',
    icon: Paperclip,
  },
]

export default function PatientLayout({ children }: PatientLayoutProps) {
  const params = useParams()
  const pathname = usePathname()
  const patientId = params.id as string

  const getIsActive = (item: (typeof navigationItems)[0]) => {
    const basePath = `/patients/${patientId}`
    const fullPath = `${basePath}${item.href}`

    if (item.href === '') {
      // Para el resumen (ruta base), debe ser exacta
      return pathname === basePath
    }

    // Para otras rutas, verificar si comienza con la ruta
    return pathname.startsWith(fullPath)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Navigation Tabs */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8 overflow-x-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = getIsActive(item)
              const href = `/patients/${patientId}${item.href}`

              return (
                <Link
                  key={item.id}
                  href={href}
                  className={cn(
                    'flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors',
                    isActive
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}
