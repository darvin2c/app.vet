import type { Perm } from './types'

export const paymentMethodsPerms: Perm[] = [
  {
    value: 'payment_methods:read',
    label: 'Leer',
    description: 'Permiso para leer métodos de pago',
    can: true,
  },
  {
    value: 'payment_methods:create',
    label: 'Crear',
    description: 'Permiso para crear métodos de pago',
    can: true,
  },
  {
    value: 'payment_methods:update',
    label: 'Actualizar',
    description: 'Permiso para actualizar métodos de pago',
    can: true,
  },
  {
    value: 'payment_methods:delete',
    label: 'Eliminar',
    description: 'Permiso para eliminar métodos de pago',
    can: true,
  },
]
