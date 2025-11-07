import React from 'react'
import { SupabaseOperator, FilterConfig, FilterOption } from './types'
import SearchFilter from './search-filter'
import SelectFilter from './select-filter'
import MultiSelectFilter from './multiselect-filter'
import DateFilter from './date-filter'
import BooleanFilter from './boolean-filter'
import NumberFilter from './number-filter'
import ArrayFilter from './array-filter'
import RangeFilter from './range-filter'
import TextSearchFilter from './text-search-filter'
import CustomFilter from './custom-filter'

/**
 * Mapea operadores de Supabase a componentes de filtros apropiados
 * @param config - Configuración del filtro
 * @returns Componente React apropiado para el operador
 */
export function getFilterComponent(
  config: FilterConfig
): React.ComponentType<any> {
  // Si se proporciona un componente personalizado, usarlo
  if (config.component) {
    return config.component
  }

  // Mapear operadores a componentes
  switch (config.operator) {
    // Búsqueda de texto
    case 'like':
    case 'ilike':
      return SearchFilter

    // Búsqueda de texto completo
    case 'fts':
    case 'plfts':
    case 'phfts':
    case 'wfts':
      return TextSearchFilter

    // Selección simple (igualdad o desigualdad)
    case 'eq':
    case 'neq':
      // Detectar si es fecha o número basado en el nombre del campo
      if (
        config.field.toLowerCase().includes('date') ||
        config.field.toLowerCase().includes('time')
      ) {
        return DateFilter
      }
      if (
        config.field.toLowerCase().includes('count') ||
        config.field.toLowerCase().includes('amount') ||
        config.field.toLowerCase().includes('price')
      ) {
        return NumberFilter
      }
      if (config.options && (config.options as any[]).length > 0) {
        return SelectFilter
      }
      // Si no hay opciones, usar búsqueda
      return SearchFilter

    // Selección múltiple
    case 'in':
      return MultiSelectFilter

    // Rangos numéricos
    case 'gt':
    case 'gte':
    case 'lt':
    case 'lte':
      // Detectar si es fecha o número basado en el nombre del campo
      if (
        config.field.toLowerCase().includes('date') ||
        config.field.toLowerCase().includes('time')
      ) {
        return DateFilter
      }
      return NumberFilter

    // Rangos de arrays
    case 'sl':
    case 'sr':
    case 'nxl':
    case 'nxr':
    case 'adj':
      return RangeFilter

    // Booleanos y null checks
    case 'is':
      return BooleanFilter

    // Arrays
    case 'contains':
    case 'containedBy':
    case 'overlaps':
      return ArrayFilter

    // Operadores lógicos (requieren manejo especial)
    case 'not':
    case 'or':
    case 'and':
      // Por ahora, usar CustomFilter para operadores lógicos complejos
      // Esto se puede mejorar con un LogicalFilter dedicado
      return CustomFilter

    // Valor por defecto
    default:
      return SearchFilter
  }
}

/**
 * Determina el tipo de entrada basado en el operador y el campo
 * @param operator - Operador de Supabase
 * @param field - Nombre del campo
 * @returns Tipo de entrada sugerido
 */
export function getInputType(
  operator: SupabaseOperator,
  field: string
): 'text' | 'number' | 'date' | 'boolean' | 'array' {
  switch (operator) {
    case 'like':
    case 'ilike':
    case 'fts':
    case 'plfts':
    case 'phfts':
    case 'wfts':
      return 'text'

    case 'eq':
    case 'neq':
      // Detectar tipo basado en el nombre del campo
      if (
        field.toLowerCase().includes('date') ||
        field.toLowerCase().includes('time')
      ) {
        return 'date'
      }
      if (
        field.toLowerCase().includes('count') ||
        field.toLowerCase().includes('amount') ||
        field.toLowerCase().includes('price')
      ) {
        return 'number'
      }
      return 'text'

    case 'gt':
    case 'gte':
    case 'lt':
    case 'lte':
      if (
        field.toLowerCase().includes('date') ||
        field.toLowerCase().includes('time')
      ) {
        return 'date'
      }
      return 'number'

    case 'in':
    case 'contains':
    case 'containedBy':
    case 'overlaps':
      return 'array'

    case 'is':
      return 'boolean'

    case 'sl':
    case 'sr':
    case 'nxl':
    case 'nxr':
    case 'adj':
      return 'array' // Rangos como arrays

    default:
      return 'text'
  }
}

/**
 * Obtiene las opciones predeterminadas basadas en el operador
 * @param operator - Operador de Supabase
 * @returns Opciones predeterminadas si las hay
 */
export function getDefaultOptions(
  operator: SupabaseOperator
): FilterOption[] | undefined {
  switch (operator) {
    case 'is':
      return [
        { label: 'Sí', value: true },
        { label: 'No', value: false },
        { label: 'Vacío', value: 'null' },
      ]

    default:
      return undefined
  }
}
