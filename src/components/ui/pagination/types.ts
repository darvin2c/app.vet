export interface PaginationConfig {
  pageParam?: string
  pageSizeParam?: string
}

export interface PaginationUIConfig {
  defaultPage?: number
  defaultPageSize?: number
  pageSizeOptions?: number[]
  showPageSizeSelector?: boolean
  maxPageButtons?: number
}

export interface PaginationProps {
  totalItems: number
  config?: PaginationConfig
  ui?: PaginationUIConfig
  onPageChange?: (page: number, pageSize: number) => void
  className?: string
}

export interface UsePaginationReturn {
  currentPage: number | null
  pageSize: number | null
  goToPage: (page: number) => void
  goToPrevious: () => void
  goToNext: () => void
  setPageSize: (size: number) => void
  appliedPagination: AppliedPagination
}

export interface AppliedPagination {
  page: number | null
  pageSize: number | null
}
