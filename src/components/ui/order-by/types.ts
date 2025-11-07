import { ResponsiveButtonProps } from '../responsive-button'

// Tipos para ordenamiento basados en operadores de Supabase
export type SortDirection = 'asc' | 'desc'

/**
 * Configuración de una columna ordenable
 */
export interface SortColumn {
  field: string // Campo de la base de datos
  label: string // Etiqueta mostrada al usuario
  sortable?: boolean // Si la columna es ordenable (por defecto true)
  /**
   * Tabla foránea para ordenamiento en recursos embedidos
   * @example 'cities' para ordenar por cities.name en una query con .select('name, cities(name)')
   */
  foreignTable?: string
}

/**
 * Estado de ordenamiento para una columna
 */
export interface SortState {
  field: string
  direction: SortDirection
  foreignTable?: string // Tabla foránea si aplica
}

export interface OrderByConfig {
  columns: SortColumn[] // Columnas disponibles para ordenar
  defaultSort?: SortState // Ordenamiento por defecto
  multiSort?: boolean // Permitir ordenamiento múltiple (por defecto false)
  className?: string // Clases CSS adicionales
}

/**
 * Valor de ordenamiento en la URL
 */
export interface OrderByValue {
  field: string
  direction: SortDirection
  foreignTable?: string // Tabla foránea si aplica
}

// Tipo para múltiples ordenamientos
export type OrderByValues = OrderByValue[]

/**
 * Resultado de ordenamiento aplicado (compatible con Supabase)
 */
export interface AppliedSort {
  field: string
  direction: SortDirection
  /**
   * Tabla foránea si aplica
   */
  foreignTable?: string
}

export interface OrderByProps {
  config: OrderByConfig
  onSortChange?: (appliedSorts: AppliedSort[]) => void
  className?: string
  triggerProps?: ResponsiveButtonProps
}
