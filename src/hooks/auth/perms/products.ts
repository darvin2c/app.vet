import type { Perm } from './types'

export const productsPerms: Perm[] = [
  {
    value: 'products:read',
    label: 'Leer',
    description: 'Permiso para leer productos',
    can: true,
  },
  {
    value: 'products:create',
    label: 'Crear',
    description: 'Permiso para crear productos',
    can: true,
  },
  {
    value: 'products:update',
    label: 'Actualizar',
    description: 'Permiso para actualizar productos',
    can: true,
  },
  {
    value: 'products:delete',
    label: 'Eliminar',
    description: 'Permiso para eliminar productos',
    can: true,
  },
]
