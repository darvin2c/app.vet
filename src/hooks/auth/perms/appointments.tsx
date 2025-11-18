import type { Perm } from './types'

/**
 * Permisos para manejar citas, y la agenda
 */
export const appointmentsPerms: Perm[] = [
  {
    value: 'appointments:read',
    label: 'Leer',
    description: 'Permiso para ver la agenda',
    can: true,
  },
  {
    value: 'appointments:create',
    label: 'Crear',
    description: 'Permiso para crear citas',
    can: true,
  },
  {
    value: 'appointments:update',
    label: 'Actualizar',
    description: 'Permiso para actualizar citas',
    can: true,
  },
  {
    value: 'appointments:delete',
    label: 'Eliminar',
    description: 'Permiso para eliminar citas',
    can: true,
  },
]
