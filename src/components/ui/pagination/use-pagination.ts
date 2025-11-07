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
}

export function usePagination(config?: PaginationConfig): UsePaginationReturn {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config }

  const [currentPage, setCurrentPage] = useQueryState(
    mergedConfig.pageParam,
    parseAsInteger
  )

  const [pageSize, setPageSize] = useQueryState(
    mergedConfig.pageSizeParam,
    parseAsInteger
  )

  const goToPage = useCallback(
    (page: number) => {
      const validPage = Math.max(1, page)
      setCurrentPage(validPage)
    },
    [setCurrentPage]
  )

  const goToPrevious = useCallback(() => {
    setCurrentPage(Math.max(1, (currentPage ?? 1) - 1))
  }, [currentPage, setCurrentPage])

  const goToNext = useCallback(() => {
    setCurrentPage((currentPage ?? 1) + 1)
  }, [currentPage, setCurrentPage])

  const handleSetPageSize = useCallback(
    (size: number) => {
      setPageSize(size)
      setCurrentPage(1)
    },
    [setPageSize, setCurrentPage]
  )

  const appliedPagination: AppliedPagination = useMemo(
    () => ({
      page: currentPage ?? 1,
      pageSize: pageSize ?? 20,
    }),
    [currentPage, pageSize]
  )

  return {
    currentPage,
    pageSize,
    goToPage,
    goToPrevious,
    goToNext,
    setPageSize: handleSetPageSize,
    appliedPagination,
  }
}
