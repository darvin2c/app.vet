import { ButtonGroup } from '@/components/ui/button-group'
import { Button } from '@/components/ui/button'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { usePagination } from './use-pagination'
import type { PaginationProps } from './types'
import { cn } from '@/lib/utils'

export function Pagination({
  totalItems,
  config,
  onPageChange,
  className,
}: PaginationProps) {
  const {
    currentPage,
    pageSize,
    totalPages,
    startItem,
    endItem,
    hasPrevious,
    hasNext,
    goToPage,
    goToPrevious,
    goToNext,
  } = usePagination(totalItems, config)

  const handlePageChange = (page: number) => {
    goToPage(page)
    onPageChange?.(page, pageSize)
  }

  if (totalPages <= 1) {
    return null
  }

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-sm',
        className
      )}
    >
      {/* Page info - ocultar en móvil muy pequeño */}
      <div className="hidden sm:block text-muted-foreground">
        {startItem}-{endItem} de {totalItems}
      </div>

      {/* Pagination controls */}
      <ButtonGroup>
        {/* Previous page */}
        <Button
          variant="outline"
          size="sm"
          onClick={goToPrevious}
          disabled={!hasPrevious}
          aria-label="Anterior"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">Anterior</span>
        </Button>

        {/* Current page / total */}
        <div className="flex items-center justify-center min-w-[80px] px-3 py-2 text-sm font-medium border rounded-md bg-background">
          {currentPage} de {totalPages}
        </div>

        {/* Next page */}
        <Button
          variant="outline"
          size="sm"
          onClick={goToNext}
          disabled={!hasNext}
          aria-label="Siguiente"
        >
          <span className="hidden sm:inline mr-1">Siguiente</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </ButtonGroup>
    </div>
  )
}
