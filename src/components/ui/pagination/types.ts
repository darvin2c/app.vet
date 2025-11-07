export interface PaginationConfig {
  pageParam?: string
  pageSizeParam?: string
  defaultPage?: number
  defaultPageSize?: number
  pageSizeOptions?: number[]
  showPageSizeSelector?: boolean
  maxPageButtons?: number
}

export interface PaginationProps {
  totalItems: number
  config?: PaginationConfig
  onPageChange?: (page: number, pageSize: number) => void
  className?: string
}

export interface UsePaginationReturn {
  currentPage: number
  pageSize: number
  totalPages: number
  startItem: number
  endItem: number
  hasPrevious: boolean
  hasNext: boolean
  goToPage: (page: number) => void
  goToPrevious: () => void
  goToNext: () => void
  setPageSize: (size: number) => void
}
