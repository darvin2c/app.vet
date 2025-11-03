import React from 'react'

// Tipos para filtros basados en operadores de Supabase
export type SupabaseOperator =
  | 'eq' // igual a
  | 'neq' // no igual a
  | 'gt' // mayor que
  | 'gte' // mayor o igual que
  | 'lt' // menor que
  | 'lte' // menor o igual que
  | 'like' // contiene (para búsquedas de texto)
  | 'ilike' // contiene (case insensitive)
  | 'in' // está en (para arrays)
  | 'is' // es (para null/not null)
  | 'not' // no es
  | 'contains' // contiene (para arrays/json)
  | 'overlap' // se superpone (para arrays)

export type FilterType =
  | 'search' // Input de búsqueda (usa like/ilike)
  | 'select' // Select simple (usa eq)
  | 'multiselect' // Select múltiple (usa in)
  | 'date' // Input de fecha (usa gte/lte)
  | 'dateRange' // Rango de fechas (usa gte y lte)
  | 'boolean' // Checkbox (usa eq)
  | 'number' // Input numérico (usa eq/gt/gte/lt/lte)
  | 'custom' // Componente personalizado

export interface FilterOption {
  label: string
  value: string | number | boolean
}

export interface BaseFilterConfig {
  key: string // Clave única para el filtro
  field: string // Campo de la base de datos
  label: string // Etiqueta mostrada al usuario
  type: FilterType // Tipo de componente UI
  operator: SupabaseOperator // Operador de Supabase a usar
  placeholder?: string // Placeholder para inputs
  defaultValue?: any // Valor por defecto
}

export interface SearchFilterConfig extends BaseFilterConfig {
  type: 'search'
  operator: 'like' | 'ilike'
}

export interface SelectFilterConfig extends BaseFilterConfig {
  type: 'select'
  operator: 'eq'
  options: FilterOption[]
}

export interface MultiSelectFilterConfig extends BaseFilterConfig {
  type: 'multiselect'
  operator: 'in' | 'contains'
  options: FilterOption[]
}

export interface DateFilterConfig extends BaseFilterConfig {
  type: 'date'
  operator: 'gte' | 'lte' | 'eq'
}

export interface DateRangeFilterConfig extends BaseFilterConfig {
  type: 'dateRange'
  operator: 'gte' | 'lte' // Se usarán ambos: gte para from, lte para to
}

export interface BooleanFilterConfig extends BaseFilterConfig {
  type: 'boolean'
  operator: 'eq' | 'is'
}

export interface NumberFilterConfig extends BaseFilterConfig {
  type: 'number'
  operator: 'eq' | 'gt' | 'gte' | 'lt' | 'lte'
}

export interface CustomFilterConfig extends BaseFilterConfig {
  type: 'custom'
  component: React.ReactNode
}

export type FilterConfig =
  | SearchFilterConfig
  | SelectFilterConfig
  | MultiSelectFilterConfig
  | DateFilterConfig
  | DateRangeFilterConfig
  | BooleanFilterConfig
  | NumberFilterConfig
  | CustomFilterConfig

// Tipo para los valores de filtros en la URL
export interface FilterValues {
  [key: string]: string | string[] | undefined
}

// Tipo para el resultado de filtros aplicados
export interface AppliedFilter {
  field: string
  operator: SupabaseOperator
  value: any
}

// Configuración completa de filtros para un componente
export interface FiltersConfig {
  filters: FilterConfig[]
  onFiltersChange?: (appliedFilters: AppliedFilter[]) => void
  className?: string
}
