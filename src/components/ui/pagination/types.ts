export interface PaginationProps {
  page: number
  pageSize: number
  showPageSizeSelector?: boolean
  currentPage?: number
  goToPage: (page: number) => void
  goToPrevious: () => void
  goToNext: () => void
  setPageSize: (size: number) => void
  totalItems?: number
  maxPageButtons?: number
  onPageChange?: (page: number, pageSize: number) => void
  pageParam?: string
  pageSizeParam?: string
  className?: string
}

export interface UsePaginationReturn {
  paginationProps: PaginationProps
  appliedPagination: AppliedPagination
}

export interface AppliedPagination {
  page: number
  pageSize: number
}
