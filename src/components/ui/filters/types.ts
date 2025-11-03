import React from 'react'

// Operadores de Supabase simplificados
export type SupabaseOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'like'
  | 'ilike'
  | 'in'
  | 'is'
  | 'contains'

// Tipos de filtros
export type FilterType =
  | 'search'
  | 'select'
  | 'multiselect'
  | 'date'
  | 'dateRange'
  | 'boolean'
  | 'number'
  | 'custom'

// Opción de filtro
export interface FilterOption {
  label: string
  value: string | number | boolean
}

// Configuración base de filtro
export interface FilterConfig {
  key: string
  field?: string
  label: string
  type: FilterType
  operator?: SupabaseOperator
  placeholder?: string
  defaultValue?: any
  options?: FilterOption[]
  component?: React.ComponentType<any>
}

// Filtro aplicado
export interface AppliedFilter {
  key: string
  field: string
  operator: SupabaseOperator
  value: any
  type: FilterType
}

// Props del componente Filters
export interface FiltersProps {
  filters: FilterConfig[]
  onFiltersChange?: (appliedFilters: AppliedFilter[]) => void
  className?: string
  children?: React.ReactNode
  triggerProps?: React.ComponentProps<any>
}

// Props comunes para componentes de filtro
export interface FilterComponentProps {
  config: FilterConfig
  value: any
  onChange: (value: any) => void
}

// Tipos específicos de configuración de filtros
export interface SearchFilterConfig extends FilterConfig {
  type: 'search'
}

export interface SelectFilterConfig extends FilterConfig {
  type: 'select'
  options: FilterOption[]
}

export interface MultiSelectFilterConfig extends FilterConfig {
  type: 'multiselect'
  options: FilterOption[]
}

export interface DateFilterConfig extends FilterConfig {
  type: 'date'
}

export interface DateRangeFilterConfig extends FilterConfig {
  type: 'dateRange'
}

export interface BooleanFilterConfig extends FilterConfig {
  type: 'boolean'
  trueLabel?: string
  falseLabel?: string
}

export interface NumberFilterConfig extends FilterConfig {
  type: 'number'
}

export interface CustomFilterConfig extends FilterConfig {
  type: 'custom'
  component: React.ComponentType<any>
}
