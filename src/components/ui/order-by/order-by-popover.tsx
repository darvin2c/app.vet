'use client'

import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { OrderByTrigger } from './order-by-trigger'
import { SortDirectionIcon } from './order-by-table-header'
import type { SortDirection, SortColumn } from './types'
import { ResponsiveButtonProps } from '../responsive-button'

export interface OrderByPopoverProps {
  sortableColumns: SortColumn[]
  activeSortsCount: number
  setSort: (
    field: string,
    foreignTable?: string,
    direction?: SortDirection
  ) => void
  clearSort: () => void
  getSortDirection: (
    field: string,
    foreignTable?: string
  ) => SortDirection | null
  isSorted: (field: string, foreignTable?: string) => boolean
  className?: string
  triggerProps?: ResponsiveButtonProps
}

export function OrderByPopover({
  sortableColumns,
  activeSortsCount,
  setSort,
  clearSort,
  getSortDirection,
  isSorted,
  className,
  triggerProps,
}: OrderByPopoverProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <OrderByTrigger activeSortsCount={activeSortsCount} {...triggerProps} />
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
              const direction = getSortDirection(
                column.field,
                column.foreignTable
              )
              const isActive = isSorted(column.field, column.foreignTable)

              // Mostrar etiqueta con tabla foránea si existe
              const displayLabel = column.foreignTable
                ? `${column.foreignTable}.${column.label || column.field}`
                : column.label

              return (
                <Button
                  key={`${column.field}-${column.foreignTable || 'main'}`}
                  variant={isActive ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setSort(column.field, column.foreignTable)}
                  className="w-full justify-between h-8"
                >
                  <span className="text-sm">{displayLabel}</span>
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
