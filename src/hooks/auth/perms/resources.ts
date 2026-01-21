import type { Resource } from './types'

export const RESOURCES: Resource[] = [
  {
    value: 'appointments',
    label: 'Citas',
    description: 'Permisos para manejar citas, y la agenda',
    group: 'vet',
  },
  {
    value: 'customers',
    label: 'Clientes',
    description: 'Permisos para clientes',
    group: 'vet',
  },
  {
    value: 'pets',
    label: 'Mascotas',
    description: 'Permisos para mascotas',
    group: 'vet',
  },
  {
    value: 'orders',
    label: 'Órdenes',
    description: 'Permisos para órdenes',
    group: 'sales',
  },
  {
    value: 'payments',
    label: 'Pagos',
    description: 'Permisos para pagos',
    group: 'sales',
  },
  {
    value: 'products',
    label: 'Productos',
    description: 'Permisos para productos',
    group: 'sales',
  },
  {
    value: 'services',
    label: 'Servicios',
    description: 'Permisos para servicios',
    group: 'sales',
  },
  {
    value: 'product_movements',
    label: 'Kardex',
    description: 'Permisos para kardex',
    group: 'sales',
  },
  {
    value: 'suppliers',
    label: 'Proveedores',
    description: 'Permisos para proveedores',
    group: 'sales',
  },
  {
    value: 'users',
    label: 'Usuarios',
    description: 'Permisos para usuarios',
    group: 'security',
  },
  {
    value: 'roles',
    label: 'Roles',
    description: 'Permisos para roles',
    group: 'security',
  },
  {
    value: 'settings',
    label: 'Configuración',
    description: 'Permisos para configuración',
    group: 'settings',
  },
  {
    value: 'appointment_types',
    label: 'Tipos de Citas',
    description: 'Permisos para tipos de citas',
    group: 'references',
  },
  {
    value: 'payment_methods',
    label: 'Métodos de Pago',
    description: 'Permisos para métodos de pago',
    group: 'references',
  },
  {
    value: 'product_brands',
    label: 'Marcas de Productos',
    description: 'Permisos para marcas de productos',
    group: 'references',
  },
  {
    value: 'product_categories',
    label: 'Categorías de Productos',
    description: 'Permisos para categorías de productos',
    group: 'references',
  },
  {
    value: 'product_units',
    label: 'Unidades de Productos',
    description: 'Permisos para unidades de productos',
    group: 'references',
  },
  {
    value: 'specialties',
    label: 'Especialidades',
    description: 'Permisos para especialidades',
    group: 'references',
  },
  {
    value: 'species',
    label: 'Especies',
    description: 'Permisos para especies',
    group: 'references',
  },
  {
    value: 'staff',
    label: 'Personal',
    description: 'Permisos para personal',
    group: 'references',
  },
]
