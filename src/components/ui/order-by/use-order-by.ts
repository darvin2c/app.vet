'use client'

import { useCallback, useMemo } from 'react'
import { useQueryStates } from 'nuqs'
import type {
  OrderByConfig,
  SortState,
  AppliedSort,
  OrderByValue,
  OrderByValues,
  SortDirection,
} from './types'

// Parser para ordenamiento simple (un solo campo)
/**
 * Parser para valores de ordenamiento simples con soporte para tablas foráneas
 * Formato: "field.direction" o "field.direction.foreignTable"
 * @example "name.asc" o "name.desc.cities"
 */
function parseAsOrderBy() {
  return {
    parse: (value: string): OrderByValue | null => {
      if (!value) return null

      // Formato esperado: "field.direction" o "field.direction.foreignTable"
      // Ejemplos: "name.asc", "price.desc", "name.asc.cities"
      const match = value.match(/^([^.]+)\.(asc|desc)(?:\.([^.]+))?$/)
      if (match) {
        const [, field, direction, foreignTable] = match
        return {
          field,
          direction: direction as SortDirection,
          ...(foreignTable && { foreignTable }),
        }
      }

      // Si no tiene formato correcto, retornar null
      return null
    },

    serialize: (parsed: OrderByValue | null): string => {
      if (!parsed) return ''
      const base = `${parsed.field}.${parsed.direction}`
      return parsed.foreignTable ? `${base}.${parsed.foreignTable}` : base
    },

    withDefault: (defaultValue: OrderByValue | null) => ({
      ...parseAsOrderBy(),
      defaultValue,
    }),
  }
}

// Parser para ordenamiento múltiple (múltiples campos)
/**
 * Parser para valores de ordenamiento múltiples con soporte para tablas foráneas
 * Formato: "field1.direction1,field2.direction2" o "field1.direction1.foreignTable1,field2.direction2"
 * @example "name.asc,created_at.desc" o "name.asc.cities,population.desc"
 */
function parseAsOrderByMultiple() {
  return {
    parse: (value: string): OrderByValues | null => {
      if (!value) return null

      // Formato esperado: "field1.asc,field2.desc" o "field1.asc.cities,field2.desc"
      const sorts = value
        .split(',')
        .map((sort) => {
          const match = sort.trim().match(/^([^.]+)\.(asc|desc)(?:\.([^.]+))?$/)
          if (match) {
            const [, field, direction, foreignTable] = match
            return {
              field,
              direction: direction as SortDirection,
              ...(foreignTable && { foreignTable }),
            }
          }
          return null
        })
        .filter(Boolean) as OrderByValues

      return sorts.length > 0 ? sorts : null
    },

    serialize: (parsed: OrderByValues | null): string => {
      if (!parsed || parsed.length === 0) return ''
      return parsed
        .map((sort) => {
          const base = `${sort.field}.${sort.direction}`
          return sort.foreignTable ? `${base}.${sort.foreignTable}` : base
        })
        .join(',')
    },

    withDefault: (defaultValue: OrderByValues | null) => ({
      ...parseAsOrderByMultiple(),
      defaultValue,
    }),
  }
}

/**
 * Hook para manejar el ordenamiento de datos con soporte para tablas foráneas
 *
 * @param config - Configuración opcional del ordenamiento
 * @returns Objeto con estado y funciones para manejar el ordenamiento
 *
 * @example
 * ```tsx
 * // Uso básico
 * const orderBy = useOrderBy({
 *   columns: [
 *     { field: 'name', label: 'Nombre' },
 *     { field: 'created_at', label: 'Fecha' }
 *   ]
 * })
 *
 * // Con tablas foráneas
 * const orderBy = useOrderBy({
 *   columns: [
 *     { field: 'name', label: 'País', foreignTable: 'countries' },
 *     { field: 'name', label: 'Ciudad', foreignTable: 'cities' }
 *   ]
 * })
 *
 * // Usar en componente
 * orderBy.setSort('name', 'cities') // Ordenar por cities.name
 * ```
 */
export function useOrderBy(config?: OrderByConfig) {
  // Si no hay configuración, retornar valores por defecto
  if (!config) {
    return {
      // Estado actual
      currentSort: [],
      appliedSorts: [],

      // Funciones de control (no-op)
      setSort: () => {},
      removeSort: () => {},
      clearSort: () => {},

      // Funciones de consulta
      getSortDirection: () => null,
      isSorted: () => false,

      // Integración con Supabase
      getSupabaseSorts: () => [],

      // Configuración
      config: undefined,
      isMultiSort: false,
    }
  }

  // Determinar si usar ordenamiento múltiple o simple
  const isMultiSort = config.multiSort ?? false

  // Crear parser dinámico basado en la configuración
  const queryParser = useMemo(() => {
    const defaultSort = config.defaultSort
      ? isMultiSort
        ? [
            {
              field: config.defaultSort.field,
              direction: config.defaultSort.direction,
            },
          ]
        : {
            field: config.defaultSort.field,
            direction: config.defaultSort.direction,
          }
      : null

    if (isMultiSort) {
      return {
        order_by: parseAsOrderByMultiple().withDefault(
          defaultSort as OrderByValues | null
        ),
      }
    } else {
      return {
        order_by: parseAsOrderBy().withDefault(
          defaultSort as OrderByValue | null
        ),
      }
    }
  }, [config.defaultSort, isMultiSort])

  const [orderByValues, setOrderByValues] = useQueryStates(queryParser)

  // Convertir valores de URL a estado de ordenamiento
  const currentSort = useMemo((): SortState[] => {
    const orderByValue = orderByValues.order_by

    if (!orderByValue) return []

    if (isMultiSort && Array.isArray(orderByValue)) {
      return orderByValue.map((sort) => ({
        field: sort.field,
        direction: sort.direction,
        ...(sort.foreignTable && { foreignTable: sort.foreignTable }),
      }))
    } else if (!isMultiSort && !Array.isArray(orderByValue)) {
      return [
        {
          field: orderByValue.field,
          direction: orderByValue.direction,
          ...(orderByValue.foreignTable && {
            foreignTable: orderByValue.foreignTable,
          }),
        },
      ]
    }

    return []
  }, [orderByValues.order_by, isMultiSort])

  // Convertir a formato compatible con Supabase
  const appliedSorts = useMemo((): AppliedSort[] => {
    return currentSort.map((sort) => ({
      field: sort.field,
      direction: sort.direction,
      ascending: sort.direction === 'asc',
      ...(sort.foreignTable && { foreignTable: sort.foreignTable }),
    }))
  }, [currentSort])

  // Función para cambiar el ordenamiento con ciclo: sin ordenar → asc → desc → sin ordenar
  const setSort = useCallback(
    (field: string, foreignTable?: string, direction?: SortDirection) => {
      const currentFieldSort = currentSort.find(
        (s) => s.field === field && s.foreignTable === foreignTable
      )

      // Si se especifica dirección, usarla directamente
      if (direction) {
        const newSort: OrderByValue = {
          field,
          direction,
          ...(foreignTable && { foreignTable }),
        }

        if (isMultiSort) {
          const existingIndex = currentSort.findIndex(
            (s) => s.field === field && s.foreignTable === foreignTable
          )
          let newSorts: OrderByValues

          if (existingIndex >= 0) {
            newSorts = [...currentSort]
            newSorts[existingIndex] = {
              field,
              direction,
              ...(foreignTable && { foreignTable }),
            }
          } else {
            newSorts = [...currentSort, newSort]
          }
          setOrderByValues({ order_by: newSorts })
        } else {
          setOrderByValues({ order_by: newSort })
        }
        return
      }

      // Ciclo automático: sin ordenar → asc → desc → sin ordenar
      if (!currentFieldSort) {
        // No hay ordenamiento actual, empezar con 'asc'
        const newSort: OrderByValue = {
          field,
          direction: 'asc',
          ...(foreignTable && { foreignTable }),
        }

        if (isMultiSort) {
          const newSorts = [...currentSort, newSort]
          setOrderByValues({ order_by: newSorts })
        } else {
          setOrderByValues({ order_by: newSort })
        }
      } else if (currentFieldSort.direction === 'asc') {
        // Cambiar de 'asc' a 'desc'
        const newSort: OrderByValue = {
          field,
          direction: 'desc',
          ...(foreignTable && { foreignTable }),
        }

        if (isMultiSort) {
          const existingIndex = currentSort.findIndex(
            (s) => s.field === field && s.foreignTable === foreignTable
          )
          const newSorts = [...currentSort]
          newSorts[existingIndex] = newSort
          setOrderByValues({ order_by: newSorts })
        } else {
          setOrderByValues({ order_by: newSort })
        }
      } else {
        // Cambiar de 'desc' a sin ordenar (remover)
        if (isMultiSort) {
          const newSorts = currentSort.filter(
            (s) => !(s.field === field && s.foreignTable === foreignTable)
          )
          setOrderByValues({ order_by: newSorts.length > 0 ? newSorts : null })
        } else {
          setOrderByValues({ order_by: null })
        }
      }
    },
    [currentSort, isMultiSort, setOrderByValues]
  )

  // Función para remover un ordenamiento (solo en modo múltiple)
  const removeSort = useCallback(
    (field: string, foreignTable?: string) => {
      if (!isMultiSort) return

      const newSorts = currentSort.filter(
        (s) => !(s.field === field && s.foreignTable === foreignTable)
      )
      setOrderByValues({
        order_by: newSorts.length > 0 ? newSorts : null,
      })
    },
    [currentSort, isMultiSort, setOrderByValues]
  )

  // Función para limpiar todos los ordenamientos
  const clearSort = useCallback(() => {
    setOrderByValues({ order_by: null })
  }, [setOrderByValues])

  // Función para obtener la dirección de ordenamiento de un campo
  const getSortDirection = useCallback(
    (field: string, foreignTable?: string): SortDirection | null => {
      const sort = currentSort.find(
        (s) => s.field === field && s.foreignTable === foreignTable
      )
      return sort?.direction || null
    },
    [currentSort]
  )

  // Función para verificar si un campo está siendo ordenado
  const isSorted = useCallback(
    (field: string, foreignTable?: string): boolean => {
      return currentSort.some(
        (s) => s.field === field && s.foreignTable === foreignTable
      )
    },
    [currentSort]
  )

  // Función para obtener filtros listos para Supabase
  const getSupabaseSorts = useCallback(() => {
    return appliedSorts.map((sort) => ({
      column: sort.field,
      ascending: sort.ascending,
      ...(sort.foreignTable && { foreignTable: sort.foreignTable }),
    }))
  }, [appliedSorts])

  return {
    // Estado actual
    currentSort,
    appliedSorts,

    // Funciones de control
    setSort,
    removeSort,
    clearSort,

    // Funciones de consulta
    getSortDirection,
    isSorted,

    // Integración con Supabase
    getSupabaseSorts,

    // Configuración
    config,
    isMultiSort,
  }
}
