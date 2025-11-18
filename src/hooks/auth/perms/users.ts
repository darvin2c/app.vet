import type { Perm } from './types'

export const usersPerms: Perm[] = [
  {
    value: 'users:read',
    label: 'Leer',
    description: 'Permiso para leer usuarios',
    can: true,
  },
  {
    value: 'users:invite',
    label: 'Invitar',
    description: 'Permiso para invitar usuarios',
    can: true,
  },
  {
    value: 'users:update',
    label: 'Actualizar',
    description: 'Permiso para actualizar usuarios',
    can: true,
  },
  {
    value: 'users:delete',
    label: 'Eliminar',
    description: 'Permiso para eliminar usuarios',
    can: true,
  },
]
