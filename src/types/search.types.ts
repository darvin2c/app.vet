// Tipos para funcionalidad de búsqueda

export interface SearchConfig {
  urlParamName?: string // Nombre del parámetro en la URL (por defecto 'search')
  debounceMs?: number // Tiempo de debounce en milisegundos (por defecto 300)
  placeholder?: string // Placeholder del input de búsqueda
  minLength?: number // Longitud mínima para activar la búsqueda (por defecto 0)
  maxLength?: number // Longitud máxima permitida
  defaultValue?: string // Valor por defecto
  className?: string // Clases CSS adicionales
}

export interface SearchState {
  value: string // Valor actual del input (inmediato)
  debouncedValue: string // Valor con debounce aplicado
  isSearching: boolean // Indica si hay una búsqueda activa
  isEmpty: boolean // Indica si la búsqueda está vacía
}

export interface SearchControls {
  setValue: (value: string) => void // Establecer valor directamente
  clear: () => void // Limpiar la búsqueda
  focus: () => void // Enfocar el input de búsqueda
}

// Resultado completo del hook useSearch
export interface UseSearchResult {
  // Estado de la búsqueda
  searchState: SearchState

  // Controles de la búsqueda
  searchControls: SearchControls

  // Valor aplicado (con debounce) - para usar en queries
  appliedSearch: string

  // Configuración actual
  config: Required<SearchConfig>
}

// Props para componentes que usan búsqueda
export interface SearchProps {
  config?: SearchConfig
  onSearchChange?: (value: string) => void
  className?: string
}

// Tipo para el valor de búsqueda en la URL
export type SearchValue = string | null

// Configuración por defecto
export const DEFAULT_SEARCH_CONFIG: Required<SearchConfig> = {
  urlParamName: 'search',
  debounceMs: 300,
  placeholder: 'Buscar...',
  minLength: 0,
  maxLength: 100,
  defaultValue: '',
  className: '',
}
