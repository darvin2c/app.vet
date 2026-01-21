import type { Perm } from './types'

export const suppliersPerms: Perm[] = [
  {
    value: 'suppliers:read',
    label: 'Leer',
    description: 'Permiso para leer proveedores',
    can: true,
  },
  {
    value: 'suppliers:create',
    label: 'Crear',
    description: 'Permiso para crear proveedores',
    can: true,
  },
  {
    value: 'suppliers:update',
    label: 'Actualizar',
    description: 'Permiso para actualizar proveedores',
    can: true,
  },
  {
    value: 'suppliers:delete',
    label: 'Eliminar',
    description: 'Permiso para eliminar proveedores',
    can: true,
  },
]
