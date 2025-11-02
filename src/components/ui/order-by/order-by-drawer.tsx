'use client'

import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { OrderByTrigger } from './order-by-trigger'
import { SortDirectionIcon } from './order-by-table-header'
import type { SortDirection, SortColumn } from './types'
import { ResponsiveButtonProps } from '../responsive-button'

export interface OrderByDrawerProps {
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

export function OrderByDrawer({
  sortableColumns,
  activeSortsCount,
  setSort,
  clearSort,
  getSortDirection,
  isSorted,
  triggerProps,
}: OrderByDrawerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <OrderByTrigger activeSortsCount={activeSortsCount} {...triggerProps} />
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
                  className="w-full justify-between h-10"
                >
                  <span>{displayLabel}</span>
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
