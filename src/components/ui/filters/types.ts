import React from 'react'

// Operadores de Supabase simplificados
export type SupabaseOperator =
  | 'eq' // igual
  | 'neq' // distinto
  | 'gt' // mayor que
  | 'gte' // mayor o igual
  | 'lt' // menor que
  | 'lte' // menor o igual
  | 'like' // patrón (sensible a mayúsculas)
  | 'ilike' // patrón (insensible a mayúsculas)
  | 'in' // valor dentro de una lista
  | 'is' // es (para null, true, false)
  | 'contains' // contiene (arrays o JSON)
  | 'containedBy' // está contenido en (arrays o JSON)
  | 'overlaps' // se superpone (arrays)
  | 'fts' // búsqueda de texto completo
  | 'plfts' // búsqueda de texto parcial
  | 'phfts' // búsqueda de frase
  | 'wfts' // búsqueda de palabras web
  | 'sl' // rango estrictamente a la izquierda
  | 'sr' // rango estrictamente a la derecha
  | 'nxl' // no extendido a la izquierda
  | 'nxr' // no extendido a la derecha
  | 'adj' // adyacente
  | 'not' // lógico NOT
  | 'or' // lógico OR
  | 'and' // lógico AND

// El tipo de filtro se determina automáticamente por el operador
// Ya no es necesario especificar FilterType manualmente

// Opción de filtro
export interface FilterOption {
  label: string
  value: string | number | boolean
}

// Configuración base de filtro
export interface FilterConfig {
  field: string // Usado como key único y campo de base de datos
  label: string
  operator: SupabaseOperator // Ahora es obligatorio
  placeholder?: string
  defaultValue?: any
  options?: FilterOption[]
  component?: React.ComponentType<any> | React.ReactElement // Componente personalizado opcional (tipo o elemento)
}

// Filtro aplicado
export interface AppliedFilter {
  field: string // Usado como key único y campo de base de datos
  operator: SupabaseOperator
  value: any
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

// Configuraciones específicas de filtros (ahora basadas en operadores)
export interface SearchFilterConfig extends FilterConfig {
  operator: 'like' | 'ilike' | 'fts' | 'plfts' | 'phfts' | 'wfts'
}

export interface SelectFilterConfig extends FilterConfig {
  operator: 'eq' | 'neq'
  options: FilterOption[]
}

export interface MultiSelectFilterConfig extends FilterConfig {
  operator: 'in'
  options: FilterOption[]
}

export interface DateFilterConfig extends FilterConfig {
  operator: 'eq' | 'gt' | 'gte' | 'lt' | 'lte'
}

export interface DateRangeFilterConfig extends FilterConfig {
  operator: 'sl' | 'sr' | 'nxl' | 'nxr' | 'adj'
}

export interface BooleanFilterConfig extends FilterConfig {
  operator: 'is'
  trueLabel?: string
  falseLabel?: string
}

export interface NumberFilterConfig extends FilterConfig {
  operator: 'eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'neq'
}

export interface ArrayFilterConfig extends FilterConfig {
  operator: 'contains' | 'containedBy' | 'overlaps'
  options?: FilterOption[]
  allowCustom?: boolean
}

export interface RangeFilterConfig extends FilterConfig {
  operator: 'sl' | 'sr' | 'nxl' | 'nxr' | 'adj'
  min?: number
  max?: number
  step?: number
}

export interface TextSearchFilterConfig extends FilterConfig {
  operator: 'fts' | 'plfts' | 'phfts' | 'wfts'
}

export interface CustomFilterConfig extends FilterConfig {
  operator: SupabaseOperator
  component: React.ComponentType<any> | React.ReactElement
}
