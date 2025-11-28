import {
  Stethoscope,
  Calendar,
  Users,
  Package,
  Ruler,
  Tag,
  Dna,
  CreditCard,
  LucideIcon,
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
    label: 'Clínica',
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
        title: 'Staff',
        href: '/references/staff',
        icon: Users,
        tooltip: 'Gestionar personal del veterinario',
      },
    ],
  },
  {
    label: 'Ventas',
    items: [
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
        title: 'Marcas de Productos',
        href: '/references/product-brands',
        icon: Tag,
        tooltip: 'Gestionar marcas de productos',
      },
    ],
  },
  {
    label: 'Configuración',
    items: [
      {
        title: 'Especies',
        href: '/references/species',
        icon: Dna,
        tooltip: 'Definir especies de animales',
      },
      {
        title: 'Métodos de Pago',
        href: '/references/payment-methods',
        icon: CreditCard,
        tooltip: 'Configurar métodos de pago disponibles',
      },
    ],
  },
]
