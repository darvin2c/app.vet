'use client'

import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'

const demoComponents = [
  {
    name: 'Alert Confirmation',
    description:
      'Componente reutilizable para confirmaciones de eliminación con validación de texto',
    href: '/demo/alert-confirmation',
  },
  {
    name: 'Filters',
    description:
      'Componente reutilizable de filtros basado en operadores de Supabase con persistencia en URL',
    href: '/demo/filters',
  },
  {
    name: 'Search',
    description:
      'Componente de búsqueda con persistencia en URL y múltiples variantes de visualización',
    href: '/demo/search',
  },
  {
    name: 'Responsive Button',
    description:
      'Botón que se adapta automáticamente al dispositivo (desktop: ícono + texto, mobile: solo ícono con tooltip)',
    href: '/demo/responsive-button',
  },
  {
    name: 'Address Input',
    description:
      'Componente de entrada de direcciones con autocompletado de Google Maps Places API',
    href: '/demo/address-input',
  },
  {
    name: 'Table Skeleton',
    description:
      'Componente reutilizable de skeleton para tablas con soporte para múltiples variantes: table, cards y list',
    href: '/demo/table-skeleton',
  },
  {
    name: 'Custom Filters',
    description:
      'Demostración de filtros personalizados usando componentes custom en el sistema de filtros',
    href: '/demo/custom-filters',
  },
  {
    name: 'Rich Minimal Editor',
    description:
      'Editor de texto enriquecido minimalista con toolbar flotante que aparece solo al seleccionar texto',
    href: '/demo/rich-text-editor',
  },
]

export default function DemoPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Demos de Componentes</h1>
          <p className="text-muted-foreground">
            Explora y prueba los componentes reutilizables del sistema de diseño
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {demoComponents.map((component) => (
            <Card
              key={component.name}
              className="group hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {component.name}
                  <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardTitle>
                <CardDescription>{component.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={component.href}>Ver Demo</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 p-6 bg-muted/50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Sobre los Demos</h2>
          <p className="text-muted-foreground mb-4">
            Esta sección contiene demostraciones interactivas de los componentes
            reutilizables del sistema. Cada demo incluye ejemplos de uso,
            variantes disponibles y documentación de las props del componente.
          </p>
          <p className="text-sm text-muted-foreground">
            Los componentes están diseñados siguiendo las mejores prácticas de
            accesibilidad y utilizan el sistema de diseño basado en shadcn/ui.
          </p>
        </div>
      </div>
    </div>
  )
}
