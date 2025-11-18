import type { Perm } from './types'

export const servicesPerms: Perm[] = [
  {
    value: 'services:read',
    label: 'Leer',
    description: 'Permiso para leer servicios',
    can: true,
  },
  {
    value: 'services:create',
    label: 'Crear',
    description: 'Permiso para crear servicios',
    can: true,
  },
  {
    value: 'services:update',
    label: 'Actualizar',
    description: 'Permiso para actualizar servicios',
    can: true,
  },
  {
    value: 'services:delete',
    label: 'Eliminar',
    description: 'Permiso para eliminar servicios',
    can: true,
  },
]
