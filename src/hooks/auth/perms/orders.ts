import type { Perm } from './types'

export const ordersPerms: Perm[] = [
  {
    value: 'orders:read',
    label: 'Leer',
    description: 'Permiso para leer órdenes',
    can: true,
  },
  {
    value: 'orders:create',
    label: 'Crear',
    description: 'Permiso para crear órdenes',
    can: true,
  },
  {
    value: 'orders:update',
    label: 'Actualizar',
    description: 'Permiso para actualizar órdenes',
    can: true,
  },
  {
    value: 'orders:delete',
    label: 'Eliminar',
    description: 'Permiso para eliminar órdenes',
    can: true,
  },
  {
    value: 'orders:pay',
    label: 'Pagar',
    description: 'Permiso para pagar órdenes',
    can: true,
  },
]
