import type { Perm } from './types'

export const productMovementsPerms: Perm[] = [
  {
    value: 'product_movements:read',
    label: 'Leer',
    description: 'Permiso para leer kardex',
    can: true,
  },
  {
    value: 'product_movements:create',
    label: 'Crear',
    description: 'Permiso para crear movimientos de kardex',
    can: true,
  },
  {
    value: 'product_movements:update',
    label: 'Actualizar',
    description: 'Permiso para actualizar movimientos de kardex',
    can: true,
  },
  {
    value: 'product_movements:delete',
    label: 'Eliminar',
    description: 'Permiso para eliminar movimientos de kardex',
    can: true,
  },
]
