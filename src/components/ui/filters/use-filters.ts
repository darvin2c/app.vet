'use client'

import { useCallback, useMemo } from 'react'
import { useQueryStates, parseAsString, parseAsArrayOf } from 'nuqs'
import type { FilterConfig, AppliedFilter } from './types'

// Parsers simplificados
const parseAsStringWithDefault = parseAsString.withDefault('')
const parseAsArrayWithDefault = parseAsArrayOf(parseAsString).withDefault([])

export function useFilters(filters: FilterConfig[]) {
  // Crear parsers dinámicamente basados en la configuración
  const parsers = useMemo(() => {
    const result: Record<string, any> = {}

    filters.forEach((filter) => {
      if (filter.type === 'multiselect') {
        result[filter.key] = parseAsArrayWithDefault
      } else if (filter.type === 'dateRange') {
        result[`${filter.key}_from`] = parseAsStringWithDefault
        result[`${filter.key}_to`] = parseAsStringWithDefault
      } else {
        result[filter.key] = parseAsStringWithDefault
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
      const field = filter.field || filter.key
      const operator = filter.operator || getDefaultOperator(filter.type)

      if (filter.type === 'dateRange') {
        const fromValue = filterValues[`${filter.key}_from`]
        const toValue = filterValues[`${filter.key}_to`]

        if (fromValue) {
          applied.push({
            key: `${filter.key}_from`,
            field,
            operator: 'gte',
            value: fromValue,
            type: filter.type,
          })
        }

        if (toValue) {
          applied.push({
            key: `${filter.key}_to`,
            field,
            operator: 'lte',
            value: toValue,
            type: filter.type,
          })
        }
      } else {
        const value = filterValues[filter.key]
        if (value && (Array.isArray(value) ? value.length > 0 : value !== '')) {
          applied.push({
            key: filter.key,
            field,
            operator,
            value: filter.type === 'search' ? `*${value}*` : value,
            type: filter.type,
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
