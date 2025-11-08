'use client'

import React, { useEffect } from 'react'
import { Filter } from 'lucide-react'

import { ResponsiveButton } from '@/components/ui/responsive-button'
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

import { getFilterComponent } from './get-filter-component'

import type { FilterConfig, FiltersProps } from './types'

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
    // Obtener el componente apropiado basado en el operador
    const FilterComponent = getFilterComponent(filter)

    return (
      <FilterComponent
        key={filter.field}
        config={filter}
        value={filterValues[filter.field] || ''}
        onChange={(value: any) => setFilter(filter.field, value)}
      />
    )
  }

  const activeFiltersCount = appliedFilters.length

  const triggerButton = (
    <ResponsiveButton
      variant="outline"
      icon={Filter}
      className={cn(
        'relative',
        activeFiltersCount > 0 && 'border-primary text-primary'
      )}
      {...triggerProps}
    >
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
