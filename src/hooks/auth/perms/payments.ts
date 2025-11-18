import type { Perm } from './types'

export const paymentsPerms: Perm[] = [
  {
    value: 'payments:read',
    label: 'Leer',
    description: 'Permiso para leer pagos',
    can: true,
  },
  {
    value: 'payments:create',
    label: 'Crear',
    description: 'Permiso para crear pagos',
    can: true,
  },
  {
    value: 'payments:update',
    label: 'Actualizar',
    description: 'Permiso para actualizar pagos',
    can: true,
  },
  {
    value: 'payments:delete',
    label: 'Eliminar',
    description: 'Permiso para eliminar pagos',
    can: true,
  },
]
