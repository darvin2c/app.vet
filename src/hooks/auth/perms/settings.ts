import type { Perm } from './types'

export const settingsPerms: Perm[] = [
  {
    value: 'settings:read',
    label: 'Leer',
    description: 'Permiso para leer configuraciones',
    can: true,
  },
  {
    value: 'settings:update',
    label: 'Actualizar',
    description: 'Permiso para actualizar configuraciones',
    can: true,
  },
]
