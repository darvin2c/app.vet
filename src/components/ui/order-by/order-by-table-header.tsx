'use client'

import React from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { SortDirection } from './types'

// Componente para mostrar el icono de dirección de ordenamiento
export function SortDirectionIcon({
  direction,
}: {
  direction: SortDirection | null
}) {
  if (direction === 'asc') {
    return <ArrowUp className="h-4 w-4" />
  }
  if (direction === 'desc') {
    return <ArrowDown className="h-4 w-4" />
  }
  return null
}

// Componente para headers de tabla con ordenamiento
export interface OrderByTableHeaderProps {
  field: string
  label?: string
  /** Tabla foránea para ordenamiento de recursos embebidos */
  foreignTable?: string
  orderByHook: {
    setSort: (
      field: string,
      foreignTable?: string,
      direction?: SortDirection
    ) => void
    getSortDirection: (
      field: string,
      foreignTable?: string
    ) => SortDirection | null
    isSorted: (field: string, foreignTable?: string) => boolean
  }
  className?: string
  children?: React.ReactNode
}

export function OrderByTableHeader({
  field,
  label,
  foreignTable,
  orderByHook,
  className,
  children,
}: OrderByTableHeaderProps) {
  const { setSort, getSortDirection, isSorted } = orderByHook
  const direction = getSortDirection(field, foreignTable)
  const isActive = isSorted(field, foreignTable)

  const handleSort = () => {
    setSort(field, foreignTable)
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
