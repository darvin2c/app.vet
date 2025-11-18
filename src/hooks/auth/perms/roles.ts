import type { Perm } from './types'

export const rolesPerms: Perm[] = [
  {
    value: 'roles:read',
    label: 'Leer',
    description: 'Permiso para leer roles',
    can: true,
  },
  {
    value: 'roles:create',
    label: 'Crear',
    description: 'Permiso para crear roles',
    can: true,
  },
  {
    value: 'roles:update',
    label: 'Actualizar',
    description: 'Permiso para actualizar roles',
    can: true,
  },
  {
    value: 'roles:delete',
    label: 'Eliminar',
    description: 'Permiso para eliminar roles',
    can: true,
  },
]
