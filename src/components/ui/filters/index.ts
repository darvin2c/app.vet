// Main components
export { Filters } from './filters'

// Hook
export { useFilters } from './use-filters'

// Individual filter components
export { default as SearchFilter } from './search-filter'
export { default as SelectFilter } from './select-filter'
export { default as MultiSelectFilter } from './multiselect-filter'
export { default as DateFilter } from './date-filter'
export { default as DateRangeFilter } from './date-range-filter'
export { default as BooleanFilter } from './boolean-filter'
export { default as NumberFilter } from './number-filter'
export { default as CustomFilter } from './custom-filter'
export { default as ArrayFilter } from './array-filter'
export { default as RangeFilter } from './range-filter'
export { default as TextSearchFilter } from './text-search-filter'

// Utilities
export { getFilterComponent, getInputType, getDefaultOptions } from './get-filter-component'
export { applySupabaseFilters } from './generate-supabase-filter'

// Types
export type {
  FilterConfig,
  AppliedFilter,
  FiltersProps,
  SupabaseOperator,
  FilterOption,
  SearchFilterConfig,
  SelectFilterConfig,
  MultiSelectFilterConfig,
  DateFilterConfig,
  DateRangeFilterConfig,
  BooleanFilterConfig,
  NumberFilterConfig,
  CustomFilterConfig,
  ArrayFilterConfig,
  RangeFilterConfig,
  TextSearchFilterConfig,
  FilterComponentProps,
} from './types'
