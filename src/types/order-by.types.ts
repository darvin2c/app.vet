// Tipos para ordenamiento basados en operadores de Supabase
export type SortDirection = 'asc' | 'desc'

export interface SortColumn {
  field: string // Campo de la base de datos
  label: string // Etiqueta mostrada al usuario
  sortable?: boolean // Si la columna es ordenable (por defecto true)
}

export interface SortState {
  field: string
  direction: SortDirection
}

export interface OrderByConfig {
  columns: SortColumn[] // Columnas disponibles para ordenar
  defaultSort?: SortState // Ordenamiento por defecto
  multiSort?: boolean // Permitir ordenamiento múltiple (por defecto false)
  className?: string // Clases CSS adicionales
}

// Tipo para el valor de ordenamiento en la URL
export interface OrderByValue {
  field: string
  direction: SortDirection
}

// Tipo para múltiples ordenamientos
export type OrderByValues = OrderByValue[]

// Tipo para el resultado de ordenamiento aplicado (compatible con Supabase)
export interface AppliedSort {
  field: string
  direction: SortDirection
  ascending: boolean // Para compatibilidad con Supabase
}

// Configuración completa de ordenamiento para un componente
export interface OrderByProps {
  config: OrderByConfig
  onSortChange?: (appliedSorts: AppliedSort[]) => void
  className?: string
}