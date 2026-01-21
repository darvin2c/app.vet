import type { Perm } from './types'

export const specialtiesPerms: Perm[] = [
  {
    value: 'specialties:read',
    label: 'Leer',
    description: 'Permiso para leer especialidades',
    can: true,
  },
  {
    value: 'specialties:create',
    label: 'Crear',
    description: 'Permiso para crear especialidades',
    can: true,
  },
  {
    value: 'specialties:update',
    label: 'Actualizar',
    description: 'Permiso para actualizar especialidades',
    can: true,
  },
  {
    value: 'specialties:delete',
    label: 'Eliminar',
    description: 'Permiso para eliminar especialidades',
    can: true,
  },
]
