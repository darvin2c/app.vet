import type { Perm } from './types'

export const productCategoriesPerms: Perm[] = [
  {
    value: 'product_categories:read',
    label: 'Leer',
    description: 'Permiso para leer categorías de productos',
    can: true,
  },
  {
    value: 'product_categories:create',
    label: 'Crear',
    description: 'Permiso para crear categorías de productos',
    can: true,
  },
  {
    value: 'product_categories:update',
    label: 'Actualizar',
    description: 'Permiso para actualizar categorías de productos',
    can: true,
  },
  {
    value: 'product_categories:delete',
    label: 'Eliminar',
    description: 'Permiso para eliminar categorías de productos',
    can: true,
  },
]
