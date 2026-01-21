import type { Perm } from './types'

export const appointmentTypesPerms: Perm[] = [
  {
    value: 'appointment_types:read',
    label: 'Leer',
    description: 'Permiso para leer tipos de citas',
    can: true,
  },
  {
    value: 'appointment_types:create',
    label: 'Crear',
    description: 'Permiso para crear tipos de citas',
    can: true,
  },
  {
    value: 'appointment_types:update',
    label: 'Actualizar',
    description: 'Permiso para actualizar tipos de citas',
    can: true,
  },
  {
    value: 'appointment_types:delete',
    label: 'Eliminar',
    description: 'Permiso para eliminar tipos de citas',
    can: true,
  },
]
