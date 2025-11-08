import { useQueryState, parseAsInteger } from 'nuqs'
import { useCallback, useMemo } from 'react'
import type { AppliedPagination, UsePaginationReturn } from './types'

type UsePaginationOptions = {
  pageParam?: string
  pageSizeParam?: string
  defaultPageSize?: number
}

export function usePagination(
  props?: UsePaginationOptions
): UsePaginationReturn {
  const {
    pageParam = 'page',
    pageSizeParam = 'pageSize',
    defaultPageSize = 20,
  } = props || {}

  const [currentPage, setCurrentPage] = useQueryState(
    pageParam,
    parseAsInteger.withDefault(1)
  )
  const [pageSize, setPageSize] = useQueryState(
    pageSizeParam,
    parseAsInteger.withDefault(defaultPageSize)
  )

  const goToPage = useCallback(
    (page: number) => {
      const validPage = Math.max(1, page)
      setCurrentPage(validPage)
    },
    [setCurrentPage]
  )

  const goToPrevious = useCallback(() => {
    setCurrentPage(Math.max(1, currentPage - 1))
  }, [currentPage, setCurrentPage])

  const goToNext = useCallback(() => {
    setCurrentPage(currentPage + 1)
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
      page: currentPage,
      pageSize: pageSize,
    }),
    [currentPage, pageSize]
  )

  return {
    paginationProps: {
      goToPage,
      goToPrevious,
      goToNext,
      setPageSize: handleSetPageSize,
      page: appliedPagination.page,
      pageSize: appliedPagination.pageSize,
      pageParam,
      pageSizeParam,
    },
    appliedPagination,
  }
}
