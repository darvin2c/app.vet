'use client'

import React, { useCallback, useMemo, useState, useRef } from 'react'
import { useQueryStates } from 'nuqs'
import { Search, X, Calendar, Filter } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

import { Button } from '@/components/ui/button'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'

import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
import { useDebounce } from '@/hooks/use-debounce'

import type {
  FiltersConfig,
  FilterConfig,
  SupabaseOperator,
  AppliedFilter,
  FilterValues,
  SearchFilterConfig,
  SelectFilterConfig,
  MultiSelectFilterConfig,
  DateFilterConfig,
  DateRangeFilterConfig,
  BooleanFilterConfig,
  NumberFilterConfig,
} from '@/types/filters.types'

// Parsers PostgREST integrados en el hook
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

function extractPostgRESTValue(
  parsed: { operator: SupabaseOperator; value: any } | null
): any {
  return parsed?.value || null
}

function createPostgRESTValue(
  operator: SupabaseOperator,
  value: any
): { operator: SupabaseOperator; value: any } | null {
  if (value === null || value === undefined || value === '') return null
  return { operator, value }
}

// Hook personalizado para manejar filtros
export function useFilters(filters: FilterConfig[]) {
  // Crear parsers dinámicos para nuqs basados en la configuración usando formato PostgREST
  const queryParsers = useMemo(() => {
    const parsers: Record<string, any> = {}

    filters.forEach((filter) => {
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
      }
    })

    return parsers
  }, [filters])

  const [filterValues, setFilterValues] = useQueryStates(queryParsers)

  // Convertir valores de filtros PostgREST a filtros aplicados
  const appliedFilters = useMemo((): AppliedFilter[] => {
    const applied: AppliedFilter[] = []

    filters.forEach((filter) => {
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
  }, [filters, filterValues])

  // Función para obtener filtros listos para Supabase
  const getSupabaseFilters = useCallback(() => {
    return appliedFilters.map((filter) => {
      let supabaseValue = filter.value

      // Formatear valores según el operador para Supabase
      switch (filter.operator) {
        case 'in':
        case 'contains':
          if (Array.isArray(filter.value)) {
            supabaseValue = `(${filter.value.map((v) => `"${v}"`).join(',')})`
          }
          break
        case 'like':
        case 'ilike':
          supabaseValue = `*${filter.value}*`
          break
        default:
          supabaseValue = filter.value
      }

      return {
        field: filter.field,
        operator: filter.operator,
        value: supabaseValue,
      }
    })
  }, [appliedFilters])

  // Limpiar todos los filtros
  const clearAllFilters = useCallback(async () => {
    const clearedValues: Record<string, any> = {}

    filters.forEach((filter) => {
      switch (filter.type) {
        case 'search':
        case 'select':
        case 'date':
        case 'number':
        case 'boolean':
          clearedValues[filter.key] = null
          break
        case 'multiselect':
          clearedValues[filter.key] = null
          break
        case 'dateRange':
          clearedValues[`${filter.key}_from`] = null
          clearedValues[`${filter.key}_to`] = null
          break
      }
    })

    // Usar await para asegurar que la actualización se complete
    await setFilterValues(clearedValues)

    // Forzar una actualización adicional después de un pequeño delay
    setTimeout(() => {
      setFilterValues(clearedValues)
    }, 10)
  }, [filters, setFilterValues])

  return {
    filterValues,
    setFilterValues,
    appliedFilters,
    getSupabaseFilters,
    clearAllFilters,
    // Funciones auxiliares para los componentes
    extractPostgRESTValue,
    createPostgRESTValue,
  }
}

interface FiltersProps extends FiltersConfig {
  className?: string
  children?: React.ReactNode
}

export function Filters({
  filters,
  onFiltersChange,
  className,
  children,
}: FiltersProps) {
  const isMobile = useIsMobile()

  // Usar el hook personalizado
  const {
    filterValues,
    setFilterValues,
    appliedFilters,
    clearAllFilters,
    extractPostgRESTValue,
    createPostgRESTValue,
  } = useFilters(filters)

  // Notificar cambios de filtros
  const prevAppliedFiltersRef = useRef<AppliedFilter[]>([])
  React.useEffect(() => {
    if (onFiltersChange) {
      // Solo llamar onFiltersChange si los filtros realmente cambiaron
      const hasChanged =
        JSON.stringify(appliedFilters) !==
        JSON.stringify(prevAppliedFiltersRef.current)
      if (hasChanged) {
        prevAppliedFiltersRef.current = appliedFilters
        onFiltersChange(appliedFilters)
      }
    }
  }, [appliedFilters, onFiltersChange])

  // Renderizar filtro individual
  const renderFilter = useCallback(
    (filter: FilterConfig) => {
      switch (filter.type) {
        case 'search':
          return (
            <SearchFilter
              key={filter.key}
              config={filter as SearchFilterConfig}
              value={extractPostgRESTValue(filterValues[filter.key]) || ''}
              onChange={(value) =>
                setFilterValues({
                  [filter.key]: createPostgRESTValue(filter.operator, value),
                })
              }
            />
          )

        case 'select':
          return (
            <SelectFilter
              key={filter.key}
              config={filter as SelectFilterConfig}
              value={extractPostgRESTValue(filterValues[filter.key]) || ''}
              onChange={(value) =>
                setFilterValues({
                  [filter.key]: createPostgRESTValue(filter.operator, value),
                })
              }
            />
          )

        case 'multiselect':
          return (
            <MultiSelectFilter
              key={filter.key}
              config={filter as MultiSelectFilterConfig}
              value={extractPostgRESTValue(filterValues[filter.key]) || []}
              onChange={(value) =>
                setFilterValues({
                  [filter.key]: createPostgRESTValue(filter.operator, value),
                })
              }
            />
          )

        case 'date':
          return (
            <DateFilter
              key={filter.key}
              config={filter as DateFilterConfig}
              value={extractPostgRESTValue(filterValues[filter.key]) || ''}
              onChange={(value) =>
                setFilterValues({
                  [filter.key]: createPostgRESTValue(filter.operator, value),
                })
              }
            />
          )

        case 'dateRange':
          return (
            <DateRangeFilter
              key={filter.key}
              config={filter as DateRangeFilterConfig}
              fromValue={
                extractPostgRESTValue(filterValues[`${filter.key}_from`]) || ''
              }
              toValue={
                extractPostgRESTValue(filterValues[`${filter.key}_to`]) || ''
              }
              onChange={(from, to) =>
                setFilterValues({
                  [`${filter.key}_from`]: createPostgRESTValue('gte', from),
                  [`${filter.key}_to`]: createPostgRESTValue('lte', to),
                })
              }
            />
          )

        case 'boolean':
          return (
            <BooleanFilter
              key={filter.key}
              config={filter as BooleanFilterConfig}
              value={extractPostgRESTValue(filterValues[filter.key]) || ''}
              onChange={(value) =>
                setFilterValues({
                  [filter.key]: createPostgRESTValue(filter.operator, value),
                })
              }
            />
          )

        case 'number':
          return (
            <NumberFilter
              key={filter.key}
              config={filter as NumberFilterConfig}
              value={extractPostgRESTValue(filterValues[filter.key]) || ''}
              onChange={(value) =>
                setFilterValues({
                  [filter.key]: createPostgRESTValue(filter.operator, value),
                })
              }
            />
          )

        default:
          return null
      }
    },
    [filterValues, setFilterValues]
  )

  // Contar filtros activos
  const activeFiltersCount = appliedFilters.length

  // Componente de contenido de filtros memoizado (solo para Popover)
  const PopoverFiltersContent = React.useMemo(
    () => (
      <div className="space-y-4">
        {/* Header con contador y botón limpiar */}
        <div className="flex items-center justify-between px-4 pt-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filtros</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </div>

          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-8 px-2 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Limpiar filtros
            </Button>
          )}
        </div>

        {/* Grid de filtros */}
        <div className="grid grid-cols-1 gap-4 px-4 pb-4">
          {filters.map(renderFilter)}
        </div>
      </div>
    ),
    [activeFiltersCount, clearAllFilters, filters, renderFilter]
  )

  // Componente de contenido de filtros para Drawer (sin header duplicado)
  const DrawerFiltersContent = React.useMemo(
    () => (
      <div className="space-y-4">
        {/* Solo botón limpiar si hay filtros activos */}
        {activeFiltersCount > 0 && (
          <div className="flex justify-end px-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-8 px-2 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Limpiar filtros
            </Button>
          </div>
        )}

        {/* Grid de filtros */}
        <div className="grid grid-cols-1 gap-4 px-4 pb-4">
          {filters.map(renderFilter)}
        </div>
      </div>
    ),
    [activeFiltersCount, clearAllFilters, filters, renderFilter]
  )

  // Componente de trigger por defecto
  const defaultTrigger = (
    <ResponsiveButton icon={Filter} tooltip="Filtros" variant="outline">
      Filtros
      {activeFiltersCount > 0 && (
        <Badge variant="secondary" className="absolute -top-2 -right-2 text-xs">
          {activeFiltersCount}
        </Badge>
      )}
    </ResponsiveButton>
  )

  // Renderizar según el dispositivo
  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>{children || defaultTrigger}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Filtros</DrawerTitle>
          </DrawerHeader>
          {DrawerFiltersContent}
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{children || defaultTrigger}</PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="start">
        {PopoverFiltersContent}
      </PopoverContent>
    </Popover>
  )
}

// Componentes de filtros individuales
const SearchFilter = React.memo(function SearchFilter({
  config,
  value,
  onChange,
}: {
  config: SearchFilterConfig
  value: string
  onChange: (value: string) => void
}) {
  // Estado local para el valor del input (sin debounce)
  const [localValue, setLocalValue] = useState(value)

  // Valor con debounce que se enviará a la URL
  const debouncedValue = useDebounce(localValue, 400)

  // Efecto para sincronizar el valor debounced con el onChange
  React.useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue)
    }
  }, [debouncedValue, onChange, value])

  // Efecto para sincronizar cambios externos con el estado local
  React.useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalValue(e.target.value)
    },
    []
  )

  return (
    <div className="space-y-2">
      <Label htmlFor={config.key} className="text-sm font-medium">
        {config.label}
      </Label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id={config.key}
          placeholder={config.placeholder}
          value={localValue}
          onChange={handleChange}
          className="pl-9"
        />
      </div>
    </div>
  )
})

function SelectFilter({
  config,
  value,
  onChange,
}: {
  config: SelectFilterConfig
  value: string
  onChange: (value: string) => void
}) {
  const handleValueChange = (newValue: string) => {
    if (newValue === '__all__') {
      onChange('')
    } else {
      onChange(newValue)
    }
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{config.label}</Label>
      <Select value={value || '__all__'} onValueChange={handleValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={config.placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">Todos</SelectItem>
          {config.options.map((option) => (
            <SelectItem
              key={option.value.toString()}
              value={option.value.toString()}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function MultiSelectFilter({
  config,
  value,
  onChange,
}: {
  config: MultiSelectFilterConfig
  value: string[]
  onChange: (value: string[]) => void
}) {
  const toggleOption = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue]
    onChange(newValue)
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{config.label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            {value.length === 0
              ? config.placeholder || 'Seleccionar...'
              : `${value.length} seleccionado${value.length > 1 ? 's' : ''}`}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <div className="p-4 space-y-2">
            {config.options.map((option) => (
              <div
                key={option.value.toString()}
                className="flex items-center space-x-2"
              >
                <Checkbox
                  id={`${config.key}-${option.value}`}
                  checked={value.includes(option.value.toString())}
                  onCheckedChange={() => toggleOption(option.value.toString())}
                />
                <Label
                  htmlFor={`${config.key}-${option.value}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Mostrar badges de selecciones */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {value.map((selectedValue) => {
            const option = config.options.find(
              (opt) => opt.value.toString() === selectedValue
            )
            return option ? (
              <Badge
                key={selectedValue}
                variant="secondary"
                className="text-xs"
              >
                {option.label}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => toggleOption(selectedValue)}
                />
              </Badge>
            ) : null
          })}
        </div>
      )}
    </div>
  )
}

function DateFilter({
  config,
  value,
  onChange,
}: {
  config: DateFilterConfig
  value: string
  onChange: (value: string) => void
}) {
  const [open, setOpen] = React.useState(false)
  const selectedDate = value ? new Date(value) : undefined

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{config.label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !selectedDate && 'text-muted-foreground'
            )}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {selectedDate
              ? format(selectedDate, 'PPP', { locale: es })
              : config.placeholder || 'Seleccionar fecha'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              onChange(date ? format(date, 'yyyy-MM-dd') : '')
              setOpen(false)
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

function DateRangeFilter({
  config,
  fromValue,
  toValue,
  onChange,
}: {
  config: DateRangeFilterConfig
  fromValue: string
  toValue: string
  onChange: (from: string, to: string) => void
}) {
  const [fromOpen, setFromOpen] = React.useState(false)
  const [toOpen, setToOpen] = React.useState(false)

  const fromDate = fromValue ? new Date(fromValue) : undefined
  const toDate = toValue ? new Date(toValue) : undefined

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{config.label}</Label>
      <div className="grid grid-cols-2 gap-2">
        {/* Fecha desde */}
        <Popover open={fromOpen} onOpenChange={setFromOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'justify-start text-left font-normal',
                !fromDate && 'text-muted-foreground'
              )}
            >
              <Calendar className="mr-1 h-3 w-3" />
              {fromDate ? format(fromDate, 'dd/MM') : 'Desde'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={fromDate}
              onSelect={(date) => {
                onChange(date ? format(date, 'yyyy-MM-dd') : '', toValue)
                setFromOpen(false)
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Fecha hasta */}
        <Popover open={toOpen} onOpenChange={setToOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'justify-start text-left font-normal',
                !toDate && 'text-muted-foreground'
              )}
            >
              <Calendar className="mr-1 h-3 w-3" />
              {toDate ? format(toDate, 'dd/MM') : 'Hasta'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={toDate}
              onSelect={(date) => {
                onChange(fromValue, date ? format(date, 'yyyy-MM-dd') : '')
                setToOpen(false)
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

function BooleanFilter({
  config,
  value,
  onChange,
}: {
  config: BooleanFilterConfig
  value: string
  onChange: (value: string) => void
}) {
  const handleValueChange = (newValue: string) => {
    if (newValue === '__all__') {
      onChange('')
    } else {
      onChange(newValue)
    }
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{config.label}</Label>
      <Select value={value || '__all__'} onValueChange={handleValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={config.placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">Todos</SelectItem>
          <SelectItem value="true">Sí</SelectItem>
          <SelectItem value="false">No</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

const NumberFilter = React.memo(function NumberFilter({
  config,
  value,
  onChange,
}: {
  config: NumberFilterConfig
  value: string
  onChange: (value: string) => void
}) {
  // Estado local para el valor del input (sin debounce)
  const [localValue, setLocalValue] = useState(value)

  // Valor con debounce que se enviará a la URL
  const debouncedValue = useDebounce(localValue, 400)

  // Efecto para sincronizar el valor debounced con el onChange
  React.useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue)
    }
  }, [debouncedValue, onChange, value])

  // Efecto para sincronizar cambios externos con el estado local
  React.useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalValue(e.target.value)
    },
    []
  )

  return (
    <div className="space-y-2">
      <Label htmlFor={config.key} className="text-sm font-medium">
        {config.label}
      </Label>
      <Input
        id={config.key}
        type="number"
        placeholder={config.placeholder}
        value={localValue}
        onChange={handleChange}
      />
    </div>
  )
})
