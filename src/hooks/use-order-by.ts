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
} from '@/types/order-by.types'

// Parser para ordenamiento simple (un solo campo)
function parseAsOrderBy() {
  return {
    parse: (value: string): OrderByValue | null => {
      if (!value) return null

      // Formato esperado: "field.direction" (ej: "name.asc", "price.desc")
      const match = value.match(/^([^.]+)\.(asc|desc)$/)
      if (match) {
        const [, field, direction] = match
        return {
          field,
          direction: direction as SortDirection,
        }
      }

      // Si no tiene formato correcto, retornar null
      return null
    },

    serialize: (parsed: OrderByValue | null): string => {
      if (!parsed) return ''
      return `${parsed.field}.${parsed.direction}`
    },

    withDefault: (defaultValue: OrderByValue | null) => ({
      ...parseAsOrderBy(),
      defaultValue,
    }),
  }
}

// Parser para ordenamiento múltiple (múltiples campos)
function parseAsOrderByMultiple() {
  return {
    parse: (value: string): OrderByValues | null => {
      if (!value) return null

      // Formato esperado: "field1.asc,field2.desc" 
      const sorts = value.split(',').map((sort) => {
        const match = sort.trim().match(/^([^.]+)\.(asc|desc)$/)
        if (match) {
          const [, field, direction] = match
          return {
            field,
            direction: direction as SortDirection,
          }
        }
        return null
      }).filter(Boolean) as OrderByValues

      return sorts.length > 0 ? sorts : null
    },

    serialize: (parsed: OrderByValues | null): string => {
      if (!parsed || parsed.length === 0) return ''
      return parsed.map((sort) => `${sort.field}.${sort.direction}`).join(',')
    },

    withDefault: (defaultValue: OrderByValues | null) => ({
      ...parseAsOrderByMultiple(),
      defaultValue,
    }),
  }
}

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
        ? [{ field: config.defaultSort.field, direction: config.defaultSort.direction }]
        : { field: config.defaultSort.field, direction: config.defaultSort.direction }
      : null

    if (isMultiSort) {
      return {
        order_by: parseAsOrderByMultiple().withDefault(defaultSort as OrderByValues | null),
      }
    } else {
      return {
        order_by: parseAsOrderBy().withDefault(defaultSort as OrderByValue | null),
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
      }))
    } else if (!isMultiSort && !Array.isArray(orderByValue)) {
      return [{
        field: orderByValue.field,
        direction: orderByValue.direction,
      }]
    }

    return []
  }, [orderByValues.order_by, isMultiSort])

  // Convertir a formato compatible con Supabase
  const appliedSorts = useMemo((): AppliedSort[] => {
    return currentSort.map((sort) => ({
      field: sort.field,
      direction: sort.direction,
      ascending: sort.direction === 'asc',
    }))
  }, [currentSort])

  // Función para cambiar el ordenamiento con ciclo: sin ordenar → asc → desc → sin ordenar
  const setSort = useCallback(
    (field: string, direction?: SortDirection) => {
      const currentFieldSort = currentSort.find((s) => s.field === field)
      
      // Si se especifica dirección, usarla directamente
      if (direction) {
        const newSort: OrderByValue = { field, direction }
        
        if (isMultiSort) {
          const existingIndex = currentSort.findIndex((s) => s.field === field)
          let newSorts: OrderByValues

          if (existingIndex >= 0) {
            newSorts = [...currentSort]
            newSorts[existingIndex] = { field, direction }
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
        const newSort: OrderByValue = { field, direction: 'asc' }
        
        if (isMultiSort) {
          const newSorts = [...currentSort, newSort]
          setOrderByValues({ order_by: newSorts })
        } else {
          setOrderByValues({ order_by: newSort })
        }
      } else if (currentFieldSort.direction === 'asc') {
        // Cambiar de 'asc' a 'desc'
        const newSort: OrderByValue = { field, direction: 'desc' }
        
        if (isMultiSort) {
          const existingIndex = currentSort.findIndex((s) => s.field === field)
          const newSorts = [...currentSort]
          newSorts[existingIndex] = newSort
          setOrderByValues({ order_by: newSorts })
        } else {
          setOrderByValues({ order_by: newSort })
        }
      } else {
        // Cambiar de 'desc' a sin ordenar (remover)
        if (isMultiSort) {
          const newSorts = currentSort.filter((s) => s.field !== field)
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
    (field: string) => {
      if (!isMultiSort) return

      const newSorts = currentSort.filter((s) => s.field !== field)
      setOrderByValues({ 
        order_by: newSorts.length > 0 ? newSorts : null 
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
    (field: string): SortDirection | null => {
      const sort = currentSort.find((s) => s.field === field)
      return sort?.direction || null
    },
    [currentSort]
  )

  // Función para verificar si un campo está siendo ordenado
  const isSorted = useCallback(
    (field: string): boolean => {
      return currentSort.some((s) => s.field === field)
    },
    [currentSort]
  )

  // Función para obtener filtros listos para Supabase
  const getSupabaseSorts = useCallback(() => {
    return appliedSorts.map((sort) => ({
      column: sort.field,
      ascending: sort.ascending,
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