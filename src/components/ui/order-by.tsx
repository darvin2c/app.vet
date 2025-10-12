'use client'

import React, { useState } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { useIsMobile } from '@/hooks/use-mobile'
import { useOrderBy } from '@/hooks/use-order-by'

import type {
  OrderByProps,
  SortDirection,
  SortColumn,
} from '@/types/order-by.types'
import { is } from 'date-fns/locale'

// Componente para mostrar el icono de dirección de ordenamiento
function SortDirectionIcon({ direction }: { direction: SortDirection | null }) {
  if (direction === 'asc') {
    return <ArrowUp className="h-4 w-4" />
  }
  if (direction === 'desc') {
    return <ArrowDown className="h-4 w-4" />
  }
  return null
}

const OrderByTrigger = React.forwardRef<
  HTMLButtonElement,
  {
    activeSortsCount: number
    className?: string
  } & React.ComponentProps<typeof Button>
>(({ activeSortsCount, className, ...props }, ref) => {
  const isMobile = useIsMobile()
  return (
    <Button
      ref={ref}
      variant="outline"
      size="sm"
      className={cn('h-8 border-dashed', className)}
      {...props}
    >
      <ArrowUpDown className="mr-2 h-4 w-4" />
      {isMobile ? '' : 'Ordenar'}
      {activeSortsCount > 0 && (
        <Badge variant="secondary" className="ml-2 h-5 px-1 text-xs">
          {activeSortsCount}
        </Badge>
      )}
    </Button>
  )
})

OrderByTrigger.displayName = 'OrderByTrigger'

// Componente para headers de tabla con ordenamiento
export interface OrderByTableHeaderProps {
  field: string
  label?: string
  orderByHook: {
    setSort: (field: string, direction?: SortDirection) => void
    getSortDirection: (field: string) => SortDirection | null
    isSorted: (field: string) => boolean
  }
  className?: string
  children?: React.ReactNode
}

export function OrderByTableHeader({
  field,
  label,
  orderByHook,
  className,
  children,
}: OrderByTableHeaderProps) {
  const { setSort, getSortDirection, isSorted } = orderByHook
  const direction = getSortDirection(field)
  const isActive = isSorted(field)

  const handleSort = () => {
    setSort(field)
  }

  return (
    <div className={cn('flex items-center', className)}>
      {children || <span>{label}</span>}
      <Button
        variant="ghost"
        size="sm"
        className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
        onClick={handleSort}
      >
        <SortDirectionIcon direction={direction} />
        {!direction && <ArrowUpDown className="h-3 w-3 opacity-50" />}
      </Button>
    </div>
  )
}

// Componente principal OrderBy
export function OrderBy({ config, onSortChange, className }: OrderByProps) {
  const isMobile = useIsMobile()
  const {
    currentSort,
    appliedSorts,
    setSort,
    clearSort,
    getSortDirection,
    isSorted,
  } = useOrderBy(config)

  // Notificar cambios al componente padre
  React.useEffect(() => {
    onSortChange?.(appliedSorts)
  }, [appliedSorts, onSortChange])

  // Obtener columnas ordenables
  const sortableColumns = config.columns.filter((col) => col.sortable !== false)

  // Contar ordenamientos activos
  const activeSortsCount = currentSort.length

  if (isMobile) {
    return (
      <OrderByDrawer
        sortableColumns={sortableColumns}
        activeSortsCount={activeSortsCount}
        setSort={setSort}
        clearSort={clearSort}
        getSortDirection={getSortDirection}
        isSorted={isSorted}
        className={className}
      />
    )
  }

  return (
    <OrderByPopover
      sortableColumns={sortableColumns}
      activeSortsCount={activeSortsCount}
      setSort={setSort}
      clearSort={clearSort}
      getSortDirection={getSortDirection}
      isSorted={isSorted}
      className={className}
    />
  )
}

// Componente para desktop (Popover)
function OrderByPopover({
  sortableColumns,
  activeSortsCount,
  setSort,
  clearSort,
  getSortDirection,
  isSorted,
  className,
}: {
  sortableColumns: SortColumn[]
  activeSortsCount: number
  setSort: (field: string, direction?: SortDirection) => void
  clearSort: () => void
  getSortDirection: (field: string) => SortDirection | null
  isSorted: (field: string) => boolean
  className?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <OrderByTrigger activeSortsCount={activeSortsCount} />
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-sm">Ordenar por</h4>
            {activeSortsCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSort}
                className="h-6 px-2 text-xs"
              >
                Limpiar
              </Button>
            )}
          </div>

          <div className="space-y-1">
            {sortableColumns.map((column) => {
              const direction = getSortDirection(column.field)
              const isActive = isSorted(column.field)

              return (
                <Button
                  key={column.field}
                  variant={isActive ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setSort(column.field)}
                  className="w-full justify-between h-8"
                >
                  <span className="text-sm">{column.label}</span>
                  <SortDirectionIcon direction={direction} />
                </Button>
              )
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Componente para mobile (Drawer)
function OrderByDrawer({
  sortableColumns,
  activeSortsCount,
  setSort,
  clearSort,
  getSortDirection,
  isSorted,
  className,
}: {
  sortableColumns: SortColumn[]
  activeSortsCount: number
  setSort: (field: string, direction?: SortDirection) => void
  clearSort: () => void
  getSortDirection: (field: string) => SortDirection | null
  isSorted: (field: string) => boolean
  className?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <OrderByTrigger activeSortsCount={activeSortsCount} />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Ordenar por</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 pb-8">
          {activeSortsCount > 0 && (
            <div className="mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={clearSort}
                className="w-full"
              >
                Limpiar ordenamiento
              </Button>
            </div>
          )}

          <div className="space-y-2">
            {sortableColumns.map((column) => {
              const direction = getSortDirection(column.field)
              const isActive = isSorted(column.field)

              return (
                <Button
                  key={column.field}
                  variant={isActive ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setSort(column.field)}
                  className="w-full justify-between h-10"
                >
                  <span>{column.label}</span>
                  <SortDirectionIcon direction={direction} />
                </Button>
              )
            })}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
