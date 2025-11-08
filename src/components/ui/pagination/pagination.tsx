import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { PaginationProps } from './types'
import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes } from 'react'

interface PageButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  page: number
  isActive: boolean
}

function PageButton({ page, isActive, ...props }: PageButtonProps) {
  return (
    <Button
      variant={isActive ? 'default' : 'ghost'}
      size="sm"
      className={cn(
        'min-w-8 h-8 px-2',
        isActive && 'bg-blue-500 hover:bg-blue-600 text-white'
      )}
      {...props}
    >
      {page}
    </Button>
  )
}

function Ellipsis() {
  return (
    <span className="flex items-center justify-center min-w-8 h-8 text-muted-foreground">
      ...
    </span>
  )
}

function getPageNumbers(
  currentPage: number,
  totalPages: number,
  maxButtons: number = 7
): (number | 'ellipsis')[] {
  const pages: (number | 'ellipsis')[] = []

  if (totalPages <= maxButtons) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)

    const edge = 3
    if (currentPage <= edge) {
      pages.push(2, 3, 4, 'ellipsis', totalPages)
    } else if (currentPage >= totalPages - (edge - 1)) {
      pages.push(
        'ellipsis',
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      )
    } else {
      pages.push(
        'ellipsis',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        'ellipsis',
        totalPages
      )
    }
  }

  return pages
}

export function Pagination({
  totalItems,
  page,
  pageSize,
  showPageSizeSelector,
  maxPageButtons,
  onPageChange,
  className,
}: PaginationProps & { totalItems: number }) {
  const totalPages = Math.ceil((totalItems ?? 0) / pageSize) || 1
  const startItem = (page - 1) * pageSize + 1
  const endItem = Math.min(page * pageSize, totalItems ?? 0)
  const hasPrevious = page > 1
  const hasNext = page < totalPages

  const handlePageChange = (nextPage: number) => {
    const validPage = Math.max(1, Math.min(nextPage, totalPages))
    onPageChange?.(validPage, pageSize)
  }

  if (totalPages <= 1) {
    return null
  }

  const pageNumbers = getPageNumbers(page, totalPages, maxPageButtons ?? 7)

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-sm',
        className
      )}
    >
      {/* Page info - hidden on small screens */}
      <div className="hidden sm:block text-muted-foreground absolute left-0">
        {startItem}-{endItem} de {totalItems}
      </div>

      {/* Pagination controls - centered */}
      <div className="flex items-center gap-1">
        {/* Previous page */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handlePageChange(page - 1)}
          disabled={!hasPrevious}
          aria-label="Anterior"
          className="min-w-8 h-8 px-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page numbers */}
        {pageNumbers.map((p, index) => {
          if (p === 'ellipsis') {
            return <Ellipsis key={`ellipsis-${index}`} />
          }

          return (
            <PageButton
              key={p}
              page={p}
              isActive={p === page}
              onClick={() => handlePageChange(p)}
              aria-label={`Ir a página ${p}`}
            />
          )
        })}

        {/* Next page */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handlePageChange(page + 1)}
          disabled={!hasNext}
          aria-label="Siguiente"
          className="min-w-8 h-8 px-2"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Optional: page size selector placeholder (no UI change for now) */}
      {showPageSizeSelector && (
        <div className="sr-only">Selector de tamaño de página pendiente</div>
      )}
    </div>
  )
}
