'use client'

import { useCallback, useMemo, useRef, useEffect, useState } from 'react'
import { useQueryState, parseAsString } from 'nuqs'
import { useDebounce } from '@/hooks/use-debounce'
import type {
  SearchConfig,
  SearchState,
  SearchControls,
  UseSearchResult,
} from '@/types/search.types'
import { DEFAULT_SEARCH_CONFIG } from '@/types/search.types'

// Parser para búsqueda simple
function parseAsSearch() {
  return {
    parse: (value: string): string | null => {
      return value || null
    },

    serialize: (parsed: string | null): string => {
      return parsed || ''
    },

    withDefault: (defaultValue: string | null) => ({
      ...parseAsSearch(),
      defaultValue,
    }),
  }
}

export function useSearch(config?: SearchConfig): UseSearchResult {
  // Combinar configuración con valores por defecto
  const finalConfig = useMemo(
    (): Required<SearchConfig> => ({
      ...DEFAULT_SEARCH_CONFIG,
      ...config,
    }),
    [config]
  )

  // Si no hay configuración, retornar valores por defecto
  if (!config) {
    return {
      searchState: {
        value: '',
        debouncedValue: '',
        isSearching: false,
        isEmpty: true,
      },
      searchControls: {
        setValue: () => {},
        clear: () => {},
        focus: () => {},
      },
      appliedSearch: '',
      config: finalConfig,
    }
  }

  // Referencia para el input (para focus)
  const inputRef = useRef<HTMLInputElement>(null)

  // Estado de la URL usando nuqs
  const [urlValue, setUrlValue] = useQueryState(
    finalConfig.urlParamName,
    parseAsString.withDefault(finalConfig.defaultValue)
  )

  // Estado local para el valor del input (respuesta inmediata en UI)
  const [localValue, setLocalValue] = useState(urlValue)

  // Valor con debounce que se enviará a la URL
  const debouncedValue = useDebounce(localValue, finalConfig.debounceMs)

  // Efecto para sincronizar el valor debounced con la URL
  useEffect(() => {
    if (debouncedValue !== urlValue) {
      setUrlValue(debouncedValue)
    }
  }, [debouncedValue, setUrlValue, urlValue])

  // Efecto para sincronizar cambios externos con el estado local
  useEffect(() => {
    setLocalValue(urlValue)
  }, [urlValue])

  // Estado de la búsqueda
  const searchState = useMemo(
    (): SearchState => ({
      value: localValue,
      debouncedValue,
      isSearching: localValue !== debouncedValue,
      isEmpty: !debouncedValue || debouncedValue.trim().length === 0,
    }),
    [localValue, debouncedValue]
  )

  // Controles de la búsqueda
  const searchControls = useMemo(
    (): SearchControls => ({
      setValue: useCallback(
        (value: string) => {
          // Validar longitud máxima
          if (finalConfig.maxLength && value.length > finalConfig.maxLength) {
            return
          }
          setLocalValue(value)
        },
        [finalConfig.maxLength]
      ),

      clear: useCallback(() => {
        setLocalValue('')
        inputRef.current?.focus()
      }, []),

      focus: useCallback(() => {
        inputRef.current?.focus()
      }, []),
    }),
    [finalConfig.maxLength]
  )

  // Valor aplicado (con debounce y validación de longitud mínima)
  const appliedSearch = useMemo(() => {
    if (
      finalConfig.minLength &&
      debouncedValue.length < finalConfig.minLength
    ) {
      return ''
    }
    return debouncedValue
  }, [debouncedValue, finalConfig.minLength])

  return {
    searchState,
    searchControls,
    appliedSearch,
    config: finalConfig,
  }
}

// Hook simplificado que solo retorna el valor aplicado (para casos simples)
export function useSimpleSearch(
  urlParamName = 'search',
  debounceMs = 300
): string {
  const { appliedSearch } = useSearch({
    urlParamName,
    debounceMs,
  })

  return appliedSearch
}

// Hook que retorna tanto el valor como las funciones de control
export function useSearchWithControls(config?: SearchConfig) {
  const result = useSearch(config)

  return {
    search: result.appliedSearch,
    searchValue: result.searchState.value,
    isSearching: result.searchState.isSearching,
    setSearch: result.searchControls.setValue,
    clearSearch: result.searchControls.clear,
    focusSearch: result.searchControls.focus,
  }
}
