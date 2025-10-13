import { Stethoscope, Calendar, Package, Ruler, LucideIcon } from 'lucide-react'

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  tooltip: string
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

// Estructura de datos organizada para la navegación de referencias
export const navigationGroups: NavGroup[] = [
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
      {
        title: 'Especies',
        href: '/references/species',
        icon: Ruler,
        tooltip: 'Definir especies de animales',
      },
    ],
  },
]
