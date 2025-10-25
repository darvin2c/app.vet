import {
  Stethoscope,
  Calendar,
  Package,
  Ruler,
  LucideIcon,
  Briefcase,
  Dna,
} from 'lucide-react'

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
        title: 'Métodos de Pago',
        href: '/references/payment-methods',
        icon: Briefcase,
        tooltip: 'Configurar métodos de pago disponibles',
      },
      {
        title: 'Especies',
        href: '/references/species',
        icon: Dna,
        tooltip: 'Definir especies de animales',
      },
      {
        title: 'Staff',
        href: '/references/staff',
        icon: Briefcase,
        tooltip: 'Gestionar personal del veterinario',
      },
    ],
  },
]
