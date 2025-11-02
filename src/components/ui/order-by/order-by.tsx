'use client'

import React from 'react'

import { useIsMobile } from '@/hooks/use-mobile'
import { useOrderBy } from './use-order-by'
import { OrderByPopover } from './order-by-popover'
import { OrderByDrawer } from './order-by-drawer'
import type { OrderByProps } from './types'

export function OrderBy({
  config,
  onSortChange,
  className,
  triggerProps,
}: OrderByProps) {
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
        triggerProps={triggerProps}
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
      triggerProps={triggerProps}
    />
  )
}
