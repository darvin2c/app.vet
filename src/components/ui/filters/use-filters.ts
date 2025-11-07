'use client'

import { useCallback, useMemo } from 'react'
import { useQueryStates, parseAsString, parseAsArrayOf } from 'nuqs'
import type { FilterConfig, AppliedFilter, SupabaseOperator } from './types'

// Parsers simplificados
const parseAsStringWithDefault = parseAsString.withDefault('')
const parseAsArrayWithDefault = parseAsArrayOf(parseAsString).withDefault([])

export function useFilters(filters: FilterConfig[]) {
  // Crear parsers dinámicamente basados en la configuración
  const parsers = useMemo(() => {
    const result: Record<string, any> = {}

    filters.forEach((filter) => {
      // Detectar tipo de filtro basado en el operador
      const filterType = getInputType(filter.operator, filter.field)

      if (filterType === 'array') {
        result[filter.field] = parseAsArrayWithDefault
      } else if (
        filter.operator === 'sl' ||
        filter.operator === 'sr' ||
        filter.operator === 'nxl' ||
        filter.operator === 'nxr' ||
        filter.operator === 'adj'
      ) {
        // Rangos que requieren dos valores
        result[`${filter.field}_from`] = parseAsStringWithDefault
        result[`${filter.field}_to`] = parseAsStringWithDefault
      } else {
        result[filter.field] = parseAsStringWithDefault
      }
    })

    return result
  }, [filters])

  // Estado de los filtros en la URL
  const [filterValues, setFilterValues] = useQueryStates(parsers)

  // Generar filtros aplicados
  const appliedFilters = useMemo((): AppliedFilter[] => {
    const applied: AppliedFilter[] = []

    filters.forEach((filter) => {
      const field = filter.field
      const operator = filter.operator
      const filterType = getInputType(filter.operator, filter.field)

      // Manejar rangos que requieren dos valores
      if (
        filter.operator === 'sl' ||
        filter.operator === 'sr' ||
        filter.operator === 'nxl' ||
        filter.operator === 'nxr' ||
        filter.operator === 'adj'
      ) {
        const fromValue = filterValues[`${filter.field}_from`]
        const toValue = filterValues[`${filter.field}_to`]

        if (fromValue) {
          applied.push({
            field,
            operator: filter.operator,
            value: fromValue,
          })
        }

        if (toValue) {
          applied.push({
            field,
            operator: filter.operator,
            value: toValue,
          })
        }
      } else {
        // Filtros normales
        const value = filterValues[filter.field]
        if (value && (Array.isArray(value) ? value.length > 0 : value !== '')) {
          applied.push({
            field,
            operator,
            value: getProcessedValue(operator, value),
          })
        }
      }
    })

    return applied
  }, [filters, filterValues])

  // Funciones de control
  const setFilter = useCallback(
    (key: string, value: any) => {
      setFilterValues({ [key]: value })
    },
    [setFilterValues]
  )

  const clearFilter = useCallback(
    (key: string) => {
      setFilterValues({ [key]: null })
    },
    [setFilterValues]
  )

  const clearAllFilters = useCallback(() => {
    const clearValues: Record<string, null> = {}
    Object.keys(filterValues).forEach((key) => {
      clearValues[key] = null
    })
    setFilterValues(clearValues)
  }, [filterValues, setFilterValues])

  return {
    filterValues,
    appliedFilters,
    hasActiveFilters: appliedFilters.length > 0,
    activeFiltersCount: appliedFilters.length,
    setFilter,
    clearFilter,
    clearAllFilters,
  }
}

// Operador por defecto según el tipo de filtro
function getDefaultOperator(type: string) {
  switch (type) {
    case 'search':
      return 'ilike'
    case 'multiselect':
      return 'in'
    case 'boolean':
      return 'eq'
    case 'number':
      return 'eq'
    case 'date':
      return 'eq'
    default:
      return 'eq'
  }
}

/**
 * Determina el tipo de entrada basado en el operador y el campo
 */
function getInputType(
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
 * Procesa el valor según el operador
 */
function getProcessedValue(operator: SupabaseOperator, value: any): any {
  switch (operator) {
    case 'like':
    case 'ilike':
      // Agregar comodines para búsquedas parciales
      return `*${value}*`

    case 'fts':
    case 'plfts':
    case 'phfts':
    case 'wfts':
      // Búsquedas de texto completo
      return { type: operator, query: value }

    default:
      return value
  }
}
