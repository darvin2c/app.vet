import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Stethoscope, Calendar, Activity, Package, Ruler } from 'lucide-react'

const referencesSections = [
  {
    title: 'Especialidades',
    description:
      'Gestiona y configura las especialidades médicas disponibles en tu clínica. Define áreas de atención, asigna profesionales y organiza servicios especializados.',
    href: '/references/specialties',
    icon: Stethoscope,
  },
  {
    title: 'Tipos de Cita',
    description:
      'Configura los diferentes tipos de citas médicas según duración, modalidad y propósito. Personaliza consultas, controles, procedimientos y teleconsultas.',
    href: '/references/appointment-types',
    icon: Calendar,
  },
  {
    title: 'Categorías de Productos',
    description:
      'Organiza tu inventario médico en categorías lógicas. Clasifica medicamentos, insumos, equipos y materiales para una gestión eficiente.',
    href: '/references/product-categories',
    icon: Package,
  },
  {
    title: 'Unidades de Productos',
    description:
      'Define las unidades de medida para productos del inventario. Configura unidades básicas, conversiones y equivalencias para control preciso de stock.',
    href: '/references/product-units',
    icon: Ruler,
  },
]

export default function ReferencesPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-8">Referencias del Sistema</h1>

      <div className="space-y-0">
        {referencesSections.map((section, index) => {
          const IconComponent = section.icon
          return (
            <div
              key={section.href}
              className={`flex items-center justify-between py-6 px-0 ${
                index !== referencesSections.length - 1
                  ? 'border-b border-gray-200'
                  : ''
              }`}
            >
              <div className="flex items-start gap-3 flex-1">
                <IconComponent className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {section.description}
                  </p>
                </div>
              </div>

              <div className="ml-6">
                <Link href={section.href}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-gray-700 border-gray-300 hover:bg-gray-50"
                  >
                    Ir al módulo
                  </Button>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
