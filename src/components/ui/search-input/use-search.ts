'use client'

import { useQueryState, parseAsString } from 'nuqs'
import { useDebounce } from '@/hooks/use-debounce'

export function useSearch(urlParamName = 'search', debounceMs = 300) {
  // URL state
  const [search, setSearch] = useQueryState(
    urlParamName,
    parseAsString.withDefault('')
  )

  // Debounced value for actual filtering
  const appliedSearch = useDebounce(search, debounceMs)

  // Simple derived states
  const isSearching = search !== appliedSearch
  const isEmpty = !appliedSearch || appliedSearch.trim().length === 0

  return {
    search,
    setSearch,
    appliedSearch,
    isSearching,
    isEmpty,
    clear: () => setSearch(''),
  }
}
