import { useQueryState, parseAsInteger } from 'nuqs'
import { useCallback, useMemo } from 'react'
import type { AppliedPagination, UsePaginationReturn } from './types'

export function usePagination(
  pageParam: string = 'page',
  pageSizeParam: string = 'pageSize'
): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useQueryState(pageParam, parseAsInteger)
  const [pageSize, setPageSize] = useQueryState(pageSizeParam, parseAsInteger)

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
      pageSize: pageSize ?? 10,
    }),
    [currentPage, pageSize]
  )

  return {
    goToPage,
    goToPrevious,
    goToNext,
    setPageSize: handleSetPageSize,
    paginationProps: {
      page: appliedPagination.page,
      pageSize: appliedPagination.pageSize,
      pageParam,
      pageSizeParam,
    },
    appliedPagination,
  }
}
