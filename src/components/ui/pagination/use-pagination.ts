import { useQueryState, parseAsInteger } from 'nuqs'
import { useCallback, useMemo } from 'react'
import type {
  AppliedPagination,
  PaginationConfig,
  UsePaginationReturn,
} from './types'

const DEFAULT_CONFIG: Required<PaginationConfig> = {
  pageParam: 'page',
  pageSizeParam: 'pageSize',
  defaultPage: 1,
  defaultPageSize: 10,
  pageSizeOptions: [10, 20, 50, 100],
  showPageSizeSelector: true,
  maxPageButtons: 5,
}

export function usePagination(
  totalItems: number,
  config?: PaginationConfig
): UsePaginationReturn {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config }

  const [currentPage, setCurrentPage] = useQueryState(
    mergedConfig.pageParam,
    parseAsInteger.withDefault(mergedConfig.defaultPage)
  )

  const [pageSize, setPageSize] = useQueryState(
    mergedConfig.pageSizeParam,
    parseAsInteger.withDefault(mergedConfig.defaultPageSize)
  )

  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / pageSize) || 1
  }, [totalItems, pageSize])

  const startItem = useMemo(() => {
    return (currentPage - 1) * pageSize + 1
  }, [currentPage, pageSize])

  const endItem = useMemo(() => {
    return Math.min(currentPage * pageSize, totalItems)
  }, [currentPage, pageSize, totalItems])

  const hasPrevious = useMemo(() => {
    return currentPage > 1
  }, [currentPage])

  const hasNext = useMemo(() => {
    return currentPage < totalPages
  }, [currentPage, totalPages])

  const goToPage = useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(page, totalPages))
      setCurrentPage(validPage)
    },
    [totalPages, setCurrentPage]
  )

  const goToPrevious = useCallback(() => {
    if (hasPrevious) {
      setCurrentPage(currentPage - 1)
    }
  }, [hasPrevious, currentPage, setCurrentPage])

  const goToNext = useCallback(() => {
    if (hasNext) {
      setCurrentPage(currentPage + 1)
    }
  }, [hasNext, currentPage, setCurrentPage])

  const handleSetPageSize = useCallback(
    (size: number) => {
      setPageSize(size)
      setCurrentPage(1) // Reset to first page when changing page size
    },
    [setPageSize, setCurrentPage]
  )

  const appliedPagination: AppliedPagination = useMemo(
    () => ({
      page: currentPage,
      pageSize,
    }),
    [currentPage, pageSize]
  )

  return {
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
    setPageSize: handleSetPageSize,
    appliedPagination,
  }
}
