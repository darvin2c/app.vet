import type { Perm } from './types'

export const speciesPerms: Perm[] = [
  {
    value: 'species:read',
    label: 'Leer',
    description: 'Permiso para leer especies',
    can: true,
  },
  {
    value: 'species:create',
    label: 'Crear',
    description: 'Permiso para crear especies',
    can: true,
  },
  {
    value: 'species:update',
    label: 'Actualizar',
    description: 'Permiso para actualizar especies',
    can: true,
  },
  {
    value: 'species:delete',
    label: 'Eliminar',
    description: 'Permiso para eliminar especies',
    can: true,
  },
]
