import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { usePagination } from './use-pagination'
import type { PaginationProps } from './types'
import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes } from 'react'
import { useMemo } from 'react'

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
  totalPages: number
): (number | 'ellipsis')[] {
  const pages: (number | 'ellipsis')[] = []

  if (totalPages <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)

    if (currentPage <= 3) {
      // Near the beginning
      pages.push(2, 3, 4, 'ellipsis', totalPages)
    } else if (currentPage >= totalPages - 2) {
      // Near the end
      pages.push(
        'ellipsis',
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      )
    } else {
      // In the middle
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
  config,
  ui,
  onPageChange,
  className,
}: PaginationProps) {
  const { currentPage, pageSize, goToPage, goToPrevious, goToNext } =
    usePagination(config)

  const effectivePage = useMemo(() => {
    return currentPage ?? ui?.defaultPage ?? 1
  }, [currentPage, ui?.defaultPage])

  const effectivePageSize = useMemo(() => {
    return pageSize ?? ui?.defaultPageSize ?? 10
  }, [pageSize, ui?.defaultPageSize])

  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / effectivePageSize) || 1
  }, [totalItems, effectivePageSize])

  const startItem = useMemo(() => {
    return (effectivePage - 1) * effectivePageSize + 1
  }, [effectivePage, effectivePageSize])

  const endItem = useMemo(() => {
    return Math.min(effectivePage * effectivePageSize, totalItems)
  }, [effectivePage, effectivePageSize, totalItems])

  const hasPrevious = useMemo(() => {
    return effectivePage > 1
  }, [effectivePage])

  const hasNext = useMemo(() => {
    return effectivePage < totalPages
  }, [effectivePage, totalPages])

  const handlePageChange = (page: number) => {
    goToPage(page)
    onPageChange?.(page, effectivePageSize)
  }

  if (totalPages <= 1) {
    return null
  }

  const pageNumbers = getPageNumbers(effectivePage, totalPages)

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
          onClick={goToPrevious}
          disabled={!hasPrevious}
          aria-label="Anterior"
          className="min-w-8 h-8 px-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page numbers */}
        {pageNumbers.map((page, index) => {
          if (page === 'ellipsis') {
            return <Ellipsis key={`ellipsis-${index}`} />
          }

          return (
            <PageButton
              key={page}
              page={page}
              isActive={page === effectivePage}
              onClick={() => handlePageChange(page)}
              aria-label={`Ir a página ${page}`}
            />
          )
        })}

        {/* Next page */}
        <Button
          variant="ghost"
          size="sm"
          onClick={goToNext}
          disabled={!hasNext}
          aria-label="Siguiente"
          className="min-w-8 h-8 px-2"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
