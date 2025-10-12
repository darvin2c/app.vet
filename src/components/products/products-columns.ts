import type { OrderByConfig, SortColumn } from '@/types/order-by.types'

// Configuración de columnas para productos
export const PRODUCTS_COLUMNS: SortColumn[] = [
  { field: 'name', label: 'Nombre', sortable: true },
  { field: 'sku', label: 'SKU', sortable: true },
  { field: 'category_id', label: 'Categoría', sortable: true },
  { field: 'unit_id', label: 'Unidad', sortable: true },
  { field: 'is_active', label: 'Estado', sortable: true },
]

// Configuración completa para el hook useOrderBy
export const PRODUCTS_COLUMNS_CONFIG: OrderByConfig = {
  columns: PRODUCTS_COLUMNS,
  multiSort: false,
}

// Función helper para obtener la etiqueta de una columna
export function getColumnLabel(field: string): string {
  const column = PRODUCTS_COLUMNS.find(col => col.field === field)
  return column?.label || field
}

// Función helper para verificar si una columna es ordenable
export function isColumnSortable(field: string): boolean {
  const column = PRODUCTS_COLUMNS.find(col => col.field === field)
  return column?.sortable !== false
}