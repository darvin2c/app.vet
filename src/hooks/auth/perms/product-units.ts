import type { Perm } from './types'

export const productUnitsPerms: Perm[] = [
  {
    value: 'product_units:read',
    label: 'Leer',
    description: 'Permiso para leer unidades de productos',
    can: true,
  },
  {
    value: 'product_units:create',
    label: 'Crear',
    description: 'Permiso para crear unidades de productos',
    can: true,
  },
  {
    value: 'product_units:update',
    label: 'Actualizar',
    description: 'Permiso para actualizar unidades de productos',
    can: true,
  },
  {
    value: 'product_units:delete',
    label: 'Eliminar',
    description: 'Permiso para eliminar unidades de productos',
    can: true,
  },
]
