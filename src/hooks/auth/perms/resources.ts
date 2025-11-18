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
    value: 'appointments',
    label: 'Citas',
    description: 'Permisos para agenda de citas',
    group: 'vet',
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
]
