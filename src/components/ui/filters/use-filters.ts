'use client'

import { useCallback, useMemo } from 'react'
import { useQueryStates } from 'nuqs'
import type { FilterConfig, SupabaseOperator, AppliedFilter } from './type'

// Parsers PostgREST para diferentes tipos de filtros
function parseAsPostgREST(defaultOperator: SupabaseOperator = 'eq') {
  return {
    parse: (
      value: string
    ): { operator: SupabaseOperator; value: string } | null => {
      if (!value) return null

      // Buscar el patrón operator.value
      const match = value.match(/^([a-zA-Z]+)\.(.*)$/)
      if (match) {
        const [, operator, val] = match
        return {
          operator: operator as SupabaseOperator,
          value: val,
        }
      }

      // Si no tiene formato PostgREST, asumir operador por defecto
      return {
        operator: defaultOperator,
        value: value,
      }
    },

    serialize: (
      parsed: { operator: SupabaseOperator; value: string } | null
    ): string => {
      if (!parsed || !parsed.value) return ''
      return `${parsed.operator}.${parsed.value}`
    },

    withDefault: (
      defaultValue: { operator: SupabaseOperator; value: string } | null
    ) => ({
      ...parseAsPostgREST(defaultOperator),
      defaultValue,
    }),
  }
}

function parseAsPostgRESTArray(defaultOperator: SupabaseOperator = 'in') {
  return {
    parse: (
      value: string
    ): { operator: SupabaseOperator; value: string[] } | null => {
      if (!value) return null

      // Buscar el patrón operator.(value1,value2,...)
      const match = value.match(/^([a-zA-Z]+)\.\(([^)]*)\)$/)
      if (match) {
        const [, operator, valuesStr] = match
        const values = valuesStr
          ? valuesStr
              .split(',')
              .map((v) => v.trim())
              .filter(Boolean)
          : []
        return {
          operator: operator as SupabaseOperator,
          value: values,
        }
      }

      // Si no tiene formato PostgREST, asumir operador por defecto
      const values = value
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean)
      return {
        operator: defaultOperator,
        value: values,
      }
    },

    serialize: (
      parsed: { operator: SupabaseOperator; value: string[] } | null
    ): string => {
      if (!parsed || !parsed.value || parsed.value.length === 0) return ''
      return `${parsed.operator}.(${parsed.value.join(',')})`
    },

    withDefault: (
      defaultValue: { operator: SupabaseOperator; value: string[] } | null
    ) => ({
      ...parseAsPostgRESTArray(defaultOperator),
      defaultValue,
    }),
  }
}

function parseAsPostgRESTDate(defaultOperator: SupabaseOperator = 'eq') {
  return {
    parse: (
      value: string
    ): { operator: SupabaseOperator; value: string } | null => {
      if (!value) return null

      // Buscar el patrón operator.date
      const match = value.match(/^([a-zA-Z]+)\.(.*)$/)
      if (match) {
        const [, operator, dateValue] = match
        return {
          operator: operator as SupabaseOperator,
          value: dateValue,
        }
      }

      // Si no tiene formato PostgREST, asumir operador por defecto
      return {
        operator: defaultOperator,
        value: value,
      }
    },

    serialize: (
      parsed: { operator: SupabaseOperator; value: string } | null
    ): string => {
      if (!parsed || !parsed.value) return ''
      return `${parsed.operator}.${parsed.value}`
    },

    withDefault: (
      defaultValue: { operator: SupabaseOperator; value: string } | null
    ) => ({
      ...parseAsPostgRESTDate(defaultOperator),
      defaultValue,
    }),
  }
}

function parseAsPostgRESTSearch(defaultOperator: SupabaseOperator = 'ilike') {
  return {
    parse: (
      value: string
    ): { operator: SupabaseOperator; value: string } | null => {
      if (!value) return null

      // Buscar el patrón operator.*search*
      const match = value.match(/^([a-zA-Z]+)\.(.*)$/)
      if (match) {
        const [, operator, searchValue] = match
        // Remover asteriscos si están presentes
        const cleanValue = searchValue.replace(/^\*|\*$/g, '')
        return {
          operator: operator as SupabaseOperator,
          value: cleanValue,
        }
      }

      // Si no tiene formato PostgREST, asumir operador por defecto
      return {
        operator: defaultOperator,
        value: value,
      }
    },

    serialize: (
      parsed: { operator: SupabaseOperator; value: string } | null
    ): string => {
      if (!parsed || !parsed.value) return ''
      // Para búsquedas, agregar asteriscos para LIKE
      if (parsed.operator === 'like' || parsed.operator === 'ilike') {
        return `${parsed.operator}.*${parsed.value}*`
      }
      return `${parsed.operator}.${parsed.value}`
    },

    withDefault: (
      defaultValue: { operator: SupabaseOperator; value: string } | null
    ) => ({
      ...parseAsPostgRESTSearch(defaultOperator),
      defaultValue,
    }),
  }
}

// Interfaces para el resultado del hook
export interface FilterState {
  appliedFilters: AppliedFilter[]
  filterValues: Record<string, any>
  hasActiveFilters: boolean
  activeFiltersCount: number
}

export interface FilterControls {
  setFilter: (key: string, value: any) => void
  clearFilter: (key: string) => void
  clearAllFilters: () => void
  getFilterValue: (key: string) => any
  setMultipleFilters: (filters: Record<string, any>) => void
}

export interface UseFiltersResult {
  filterState: FilterState
  filterControls: FilterControls
  appliedFilters: AppliedFilter[]
  config: FilterConfig[] | undefined
}

// Hook principal useFilters
export function useFilters(config?: FilterConfig[]): UseFiltersResult {
  // Si no hay configuración, retornar valores por defecto
  if (!config) {
    return {
      filterState: {
        appliedFilters: [],
        filterValues: {},
        hasActiveFilters: false,
        activeFiltersCount: 0,
      },
      filterControls: {
        setFilter: () => {},
        clearFilter: () => {},
        clearAllFilters: () => {},
        getFilterValue: () => null,
        setMultipleFilters: () => {},
      },
      appliedFilters: [],
      config: undefined,
    }
  }

  // Crear parsers dinámicos para nuqs basados en la configuración usando formato PostgREST
  const queryParsers = useMemo(() => {
    const parsers: Record<string, any> = {}

    config.forEach((filter) => {
      switch (filter.type) {
        case 'search':
          parsers[filter.key] = parseAsPostgRESTSearch(
            filter.operator
          ).withDefault(null)
          break
        case 'select':
        case 'boolean':
        case 'number':
          parsers[filter.key] = parseAsPostgREST(filter.operator).withDefault(
            null
          )
          break
        case 'multiselect':
          parsers[filter.key] = parseAsPostgRESTArray(
            filter.operator
          ).withDefault(null)
          break
        case 'date':
          parsers[filter.key] = parseAsPostgRESTDate(
            filter.operator
          ).withDefault(null)
          break
        case 'dateRange':
          // Para dateRange, usamos dos campos separados con operadores específicos
          parsers[`${filter.key}_from`] =
            parseAsPostgRESTDate('gte').withDefault(null)
          parsers[`${filter.key}_to`] =
            parseAsPostgRESTDate('lte').withDefault(null)
          break
        case 'custom':
          // Para filtros custom, usar el operador especificado
          parsers[filter.key] = parseAsPostgREST(filter.operator).withDefault(
            null
          )
          break
      }
    })

    return parsers
  }, [config])

  const [filterValues, setFilterValues] = useQueryStates(queryParsers)

  // Convertir valores de filtros PostgREST a filtros aplicados
  const appliedFilters = useMemo((): AppliedFilter[] => {
    const applied: AppliedFilter[] = []

    config.forEach((filter) => {
      const value = filterValues[filter.key]

      switch (filter.type) {
        case 'search':
          if (value && value.value) {
            applied.push({
              field: filter.field,
              operator: value.operator,
              value: value.value,
            })
          }
          break

        case 'select':
        case 'boolean':
        case 'number':
        case 'date':
        case 'custom':
          if (value && value.value) {
            let processedValue: any = value.value

            // Convertir tipos según sea necesario
            if (filter.type === 'boolean') {
              processedValue = value.value === 'true'
            } else if (filter.type === 'number') {
              processedValue = parseFloat(value.value)
            }

            applied.push({
              field: filter.field,
              operator: value.operator,
              value: processedValue,
            })
          }
          break

        case 'multiselect':
          if (
            value &&
            value.value &&
            Array.isArray(value.value) &&
            value.value.length > 0
          ) {
            applied.push({
              field: filter.field,
              operator: value.operator,
              value: value.value,
            })
          }
          break

        case 'dateRange':
          const fromValue = filterValues[`${filter.key}_from`]
          const toValue = filterValues[`${filter.key}_to`]

          if (fromValue && fromValue.value) {
            applied.push({
              field: filter.field,
              operator: fromValue.operator,
              value: fromValue.value,
            })
          }

          if (toValue && toValue.value) {
            applied.push({
              field: filter.field,
              operator: toValue.operator,
              value: toValue.value,
            })
          }
          break
      }
    })

    return applied
  }, [config, filterValues])

  // Estado de los filtros
  const filterState = useMemo(
    (): FilterState => ({
      appliedFilters,
      filterValues,
      hasActiveFilters: appliedFilters.length > 0,
      activeFiltersCount: appliedFilters.length,
    }),
    [appliedFilters, filterValues]
  )

  // Controles de los filtros - useCallback definidos en el nivel superior
  const setFilter = useCallback(
    (key: string, value: any) => {
      const filterConfig = config.find((f) => f.key === key)
      if (!filterConfig) return

      if (value === null || value === undefined || value === '') {
        setFilterValues({ [key]: null })
        return
      }

      // Crear el valor PostgREST según el tipo de filtro
      let postgrestValue: any = null

      switch (filterConfig.type) {
        case 'search':
          postgrestValue = {
            operator: filterConfig.operator,
            value: String(value),
          }
          break
        case 'select':
        case 'boolean':
        case 'number':
        case 'date':
        case 'custom':
          postgrestValue = {
            operator: filterConfig.operator,
            value: String(value),
          }
          break
        case 'multiselect':
          if (Array.isArray(value)) {
            postgrestValue = { operator: filterConfig.operator, value }
          }
          break
        case 'dateRange':
          // Para dateRange, el value debe ser un objeto { from, to }
          if (
            typeof value === 'object' &&
            value.from !== undefined &&
            value.to !== undefined
          ) {
            const updates: Record<string, any> = {}
            if (value.from) {
              updates[`${key}_from`] = { operator: 'gte', value: value.from }
            }
            if (value.to) {
              updates[`${key}_to`] = { operator: 'lte', value: value.to }
            }
            setFilterValues(updates)
            return
          }
          break
      }

      if (postgrestValue) {
        setFilterValues({ [key]: postgrestValue })
      }
    },
    [config, setFilterValues]
  )

  const clearFilter = useCallback(
    (key: string) => {
      const filterConfig = config.find((f) => f.key === key)
      if (!filterConfig) return

      if (filterConfig.type === 'dateRange') {
        setFilterValues({
          [`${key}_from`]: null,
          [`${key}_to`]: null,
        })
      } else {
        setFilterValues({ [key]: null })
      }
    },
    [config, setFilterValues]
  )

  const clearAllFilters = useCallback(() => {
    const updates: Record<string, any> = {}

    config.forEach((filter) => {
      if (filter.type === 'dateRange') {
        updates[`${filter.key}_from`] = null
        updates[`${filter.key}_to`] = null
      } else {
        updates[filter.key] = null
      }
    })

    setFilterValues(updates)
  }, [config, setFilterValues])

  const getFilterValue = useCallback(
    (key: string) => {
      const value = filterValues[key]
      return value?.value || null
    },
    [filterValues]
  )

  const setMultipleFilters = useCallback(
    (filters: Record<string, any>) => {
      const updates: Record<string, any> = {}

      Object.entries(filters).forEach(([key, value]) => {
        const filterConfig = config.find((f) => f.key === key)
        if (!filterConfig) return

        if (value === null || value === undefined || value === '') {
          updates[key] = null
          return
        }

        // Crear el valor PostgREST según el tipo de filtro
        switch (filterConfig.type) {
          case 'search':
          case 'select':
          case 'boolean':
          case 'number':
          case 'date':
          case 'custom':
            updates[key] = {
              operator: filterConfig.operator,
              value: String(value),
            }
            break
          case 'multiselect':
            if (Array.isArray(value)) {
              updates[key] = { operator: filterConfig.operator, value }
            }
            break
          case 'dateRange':
            if (
              typeof value === 'object' &&
              value.from !== undefined &&
              value.to !== undefined
            ) {
              if (value.from) {
                updates[`${key}_from`] = { operator: 'gte', value: value.from }
              }
              if (value.to) {
                updates[`${key}_to`] = { operator: 'lte', value: value.to }
              }
            }
            break
        }
      })

      setFilterValues(updates)
    },
    [config, setFilterValues]
  )

  // Objeto de controles usando useMemo para referenciar las funciones
  const filterControls = useMemo(
    (): FilterControls => ({
      setFilter,
      clearFilter,
      clearAllFilters,
      getFilterValue,
      setMultipleFilters,
    }),
    [
      setFilter,
      clearFilter,
      clearAllFilters,
      getFilterValue,
      setMultipleFilters,
    ]
  )

  return {
    filterState,
    filterControls,
    appliedFilters,
    config,
  }
}

// Hook simplificado que solo retorna los filtros aplicados
export function useSimpleFilters(config?: FilterConfig[]): AppliedFilter[] {
  const { appliedFilters } = useFilters(config)
  return appliedFilters
}

// Hook que retorna filtros y controles básicos
export function useFiltersWithControls(config?: FilterConfig[]) {
  const result = useFilters(config)

  return {
    filters: result.appliedFilters,
    hasFilters: result.filterState.hasActiveFilters,
    filtersCount: result.filterState.activeFiltersCount,
    setFilter: result.filterControls.setFilter,
    clearFilter: result.filterControls.clearFilter,
    clearAllFilters: result.filterControls.clearAllFilters,
  }
}
