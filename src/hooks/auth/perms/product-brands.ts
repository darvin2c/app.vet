import type { Perm } from './types'

export const productBrandsPerms: Perm[] = [
  {
    value: 'product_brands:read',
    label: 'Leer',
    description: 'Permiso para leer marcas de productos',
    can: true,
  },
  {
    value: 'product_brands:create',
    label: 'Crear',
    description: 'Permiso para crear marcas de productos',
    can: true,
  },
  {
    value: 'product_brands:update',
    label: 'Actualizar',
    description: 'Permiso para actualizar marcas de productos',
    can: true,
  },
  {
    value: 'product_brands:delete',
    label: 'Eliminar',
    description: 'Permiso para eliminar marcas de productos',
    can: true,
  },
]
