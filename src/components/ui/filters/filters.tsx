'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Filter } from 'lucide-react'

import { ResponsiveButton } from '@/components/ui/responsive-button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { cn } from '@/lib/utils'
import { useFilters } from './use-filters'
import { useIsMobile } from '@/hooks/use-mobile'

import { getFilterComponent } from './get-filter-component'

import type { FilterConfig, FiltersProps } from './types'
import { Form } from '@/components/ui/form'
import CustomFilter from './custom-filter'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../sheet'

export function Filters({
  filters,
  onFiltersChange,
  children,
  triggerProps,
}: FiltersProps) {
  const isMobile = useIsMobile()
  const { filterValues, appliedFilters, setFilter } = useFilters(filters)

  // Crear contexto de formulario para encapsular el contenido
  const form = useForm({ mode: 'onChange' })

  // Llamar onFiltersChange cuando cambien los filtros aplicados
  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange(appliedFilters)
    }
  }, [appliedFilters, onFiltersChange])

  const renderFilter = (filter: FilterConfig) => {
    // Obtener el componente apropiado basado en el operador o personalizado
    const FilterComponent = getFilterComponent(filter)

    // Si es un elemento React personalizado, usar CustomFilter para inyectar props
    if (React.isValidElement(FilterComponent)) {
      return (
        <CustomFilter
          key={filter.field}
          config={filter}
          value={filterValues[filter.field] || ''}
          onChange={(value: any) => setFilter(filter.field, value)}
        />
      )
    }

    // Si es un componente tipo, renderizar con props estándar
    const CompType = FilterComponent as React.ComponentType<any>
    return (
      <CompType
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
      variant="ghost"
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
    <Form {...form}>
      <form className="space-y-4">
        {filters.map(renderFilter)}
        {children}
      </form>
    </Form>
  )

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>{triggerButton}</SheetTrigger>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Filtros</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-4">{filtersContent}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
      <PopoverContent
        onClick={(e) => e.stopPropagation()}
        className="w-80"
        align="end"
      >
        {filtersContent}
      </PopoverContent>
    </Popover>
  )
}
