'use client'

import React, { useEffect } from 'react'
import { Filter } from 'lucide-react'

import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

import { cn } from '@/lib/utils'
import { useFilters } from './use-filters'
import { useIsMobile } from '@/hooks/use-mobile'

import { SearchFilter } from './search-filter'
import { SelectFilter } from './select-filter'
import { MultiSelectFilter } from './multiselect-filter'
import { DateFilter } from './date-filter'
import { DateRangeFilter } from './date-range-filter'
import { BooleanFilter } from './boolean-filter'
import { NumberFilter } from './number-filter'
import { CustomFilter } from './custom-filter'

import type {
  FilterConfig,
  FiltersProps,
  SearchFilterConfig,
  SelectFilterConfig,
  MultiSelectFilterConfig,
  DateFilterConfig,
  DateRangeFilterConfig,
  BooleanFilterConfig,
  NumberFilterConfig,
  CustomFilterConfig,
} from './types'

export function Filters({
  filters,
  onFiltersChange,
  children,
  triggerProps,
}: FiltersProps) {
  const isMobile = useIsMobile()
  const { filterValues, appliedFilters, setFilter } = useFilters(filters)

  // Llamar onFiltersChange cuando cambien los filtros aplicados
  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange(appliedFilters)
    }
  }, [appliedFilters, onFiltersChange])

  const renderFilter = (filter: FilterConfig) => {
    const commonProps = {
      key: filter.key,
      config: filter,
    }

    switch (filter.type) {
      case 'search':
        return (
          <SearchFilter
            key={filter.key}
            config={filter as SearchFilterConfig}
            value={filterValues[filter.key] || ''}
            onChange={(value: string) => setFilter(filter.key, value)}
          />
        )

      case 'select':
        return (
          <SelectFilter
            key={filter.key}
            config={filter as SelectFilterConfig}
            value={filterValues[filter.key] || ''}
            onChange={(value: string) => setFilter(filter.key, value)}
          />
        )

      case 'multiselect':
        return (
          <MultiSelectFilter
            key={filter.key}
            config={filter as MultiSelectFilterConfig}
            value={filterValues[filter.key] || []}
            onChange={(value: string[]) => setFilter(filter.key, value)}
          />
        )

      case 'date':
        return (
          <DateFilter
            key={filter.key}
            config={filter as DateFilterConfig}
            value={filterValues[filter.key] || ''}
            onChange={(value: string) => setFilter(filter.key, value)}
          />
        )

      case 'dateRange':
        return (
          <DateRangeFilter
            key={filter.key}
            config={filter as DateRangeFilterConfig}
            fromValue={filterValues[`${filter.key}_from`] || ''}
            toValue={filterValues[`${filter.key}_to`] || ''}
            onChange={(from: string, to: string) => {
              setFilter(`${filter.key}_from`, from)
              setFilter(`${filter.key}_to`, to)
            }}
          />
        )

      case 'boolean':
        return (
          <BooleanFilter
            key={filter.key}
            config={filter as BooleanFilterConfig}
            value={filterValues[filter.key] || ''}
            onChange={(value: string) => setFilter(filter.key, value)}
          />
        )

      case 'number':
        return (
          <NumberFilter
            key={filter.key}
            config={filter as NumberFilterConfig}
            value={filterValues[filter.key] || ''}
            onChange={(value: string) => setFilter(filter.key, value)}
          />
        )

      case 'custom':
        return (
          <CustomFilter
            key={filter.key}
            config={filter as CustomFilterConfig}
            value={filterValues[filter.key] || ''}
            onChange={(value: string) => setFilter(filter.key, value)}
          />
        )

      default:
        return null
    }
  }

  const activeFiltersCount = appliedFilters.length

  const triggerButton = (
    <ResponsiveButton
      variant="outline"
      size="sm"
      className={cn(
        'relative',
        activeFiltersCount > 0 && 'border-primary text-primary'
      )}
      {...triggerProps}
    >
      <Filter className="h-4 w-4" />
      Filtros
      {activeFiltersCount > 0 && (
        <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
          {activeFiltersCount}
        </span>
      )}
    </ResponsiveButton>
  )

  const filtersContent = (
    <div className="space-y-4">
      {filters.map(renderFilter)}
      {children}
    </div>
  )

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Filtros</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4">{filtersContent}</div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        {filtersContent}
      </PopoverContent>
    </Popover>
  )
}
