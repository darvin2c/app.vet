import type { Perm } from './types'

export const petsPerms: Perm[] = [
  {
    value: 'pets:read',
    label: 'Leer',
    description: 'Permiso para leer mascotas',
    can: true,
  },
  {
    value: 'pets:create',
    label: 'Crear',
    description: 'Permiso para crear mascotas',
    can: true,
  },
  {
    value: 'pets:update',
    label: 'Actualizar',
    description: 'Permiso para actualizar mascotas',
    can: true,
  },
  {
    value: 'pets:delete',
    label: 'Eliminar',
    description: 'Permiso para eliminar mascotas',
    can: true,
  },
]
