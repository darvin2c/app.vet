import type { Perm } from './types'

export const customersPerms: Perm[] = [
  {
    value: 'customers:create',
    label: 'Crear',
    description: 'Permiso para crear clientes',
    can: true,
  },
  {
    value: 'customers:update',
    label: 'Actualizar',
    description: 'Permiso para actualizar clientes',
    can: true,
  },
  {
    value: 'customers:delete',
    label: 'Eliminar',
    description: 'Permiso para eliminar clientes',
    can: true,
  },
  {
    value: 'customers:read',
    label: 'Leer',
    description: 'Permiso para leer clientes',
    can: true,
  },
]
