import type { Perm } from './types'

export const staffPerms: Perm[] = [
  {
    value: 'staff:read',
    label: 'Leer',
    description: 'Permiso para leer personal',
    can: true,
  },
  {
    value: 'staff:create',
    label: 'Crear',
    description: 'Permiso para crear personal',
    can: true,
  },
  {
    value: 'staff:update',
    label: 'Actualizar',
    description: 'Permiso para actualizar personal',
    can: true,
  },
  {
    value: 'staff:delete',
    label: 'Eliminar',
    description: 'Permiso para eliminar personal',
    can: true,
  },
]
