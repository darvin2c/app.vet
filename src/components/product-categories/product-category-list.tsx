'use client'

import { useState, useCallback, useEffect } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  HeaderGroup,
  Header,
  Row,
  Cell,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Database } from '@/types/supabase.types'
import { ProductCategoryActions } from './product-category-actions'
import { ProductCategoryCreateButton } from './product-category-create-button'
import { IsActiveDisplay } from '@/components/ui/is-active-field'
import { OrderByTableHeader } from '@/components/ui/order-by'
import { useOrderBy } from '@/hooks/use-order-by'
import { OrderByConfig } from '@/types/order-by.types'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import { ChevronLeft, ChevronRight, Tag } from 'lucide-react'
import useProductCategoryList from '@/hooks/product-categories/use-product-category-list'
import { useFilters } from '@/hooks/use-filters'
import { FilterConfig } from '@/types/filters.types'
import { useSearch } from '@/hooks/use-search'
import { ViewModeToggle, ViewMode } from '@/components/ui/view-mode-toggle'
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
} from '@/components/ui/item'
import { getProductCategoryColumns } from './product-category-table-columns'

// Función para obtener el valor desde localStorage (duplicada de view-mode-toggle para consistencia)
function getStoredViewMode(resource: string): ViewMode {
  if (typeof window === 'undefined') return 'table'

  try {
    const storageKey = `${resource}-view-mode`
    const stored = localStorage.getItem(storageKey)
    if (stored && ['table', 'cards', 'list'].includes(stored)) {
      return stored as ViewMode
    }
  } catch (error) {
    console.warn('Error reading from localStorage:', error)
  }

  return 'table'
}

type ProductCategory = Database['public']['Tables']['product_categories']['Row']

export function ProductCategoryList({
  filterConfig = [],
  orderByConfig = {
    columns: [
      { field: 'name', label: 'Nombre' },
      { field: 'description', label: 'Descripción' },
      { field: 'is_active', label: 'Estado' },
      { field: 'created_at', label: 'Fecha de creación' },
    ],
    defaultSort: { field: 'created_at', direction: 'desc' },
    multiSort: false,
  },
}: {
  filterConfig?: FilterConfig[]
  orderByConfig?: OrderByConfig
} = {}) {
  // Estado para el modo de vista - inicializado con valor por defecto para evitar hydration mismatch
  const [viewMode, setViewMode] = useState<ViewMode>('table')

  // Usar el hook useFilters para obtener los filtros aplicados
  const { appliedFilters } = useFilters(filterConfig)
  const orderByHook = useOrderBy(orderByConfig)
  const { appliedSearch } = useSearch()
  // Usar el hook useProductCategoryList con los filtros aplicados (sin componentes React)
  console.log(appliedFilters, orderByHook.appliedSorts, appliedSearch)
  const {
    data: productCategories = [],
    isPending,
    error,
  } = useProductCategoryList({
    filters: appliedFilters,
    search: appliedSearch,
    orders: orderByHook.appliedSorts,
  })

  const columns = getProductCategoryColumns(orderByHook)

  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: productCategories,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  // Efecto para sincronizar con localStorage después de la hidratación
  useEffect(() => {
    const storedViewMode = getStoredViewMode('product-categories')
    setViewMode(storedViewMode)
  }, [])

  const renderCardsView = useCallback(
    () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {productCategories.map((productCategory) => (
          <div
            key={productCategory.id}
            className="border rounded-lg p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{productCategory.name}</h3>
                {productCategory.description && (
                  <p className="text-sm text-muted-foreground">
                    {productCategory.description}
                  </p>
                )}
              </div>
              <ProductCategoryActions category={productCategory} />
            </div>

            <div className="flex justify-between items-center">
              <IsActiveDisplay value={productCategory.is_active} />
            </div>
          </div>
        ))}
      </div>
    ),
    [productCategories]
  )

  const renderListView = useCallback(
    () => (
      <ItemGroup>
        {productCategories.map((productCategory) => (
          <Item key={productCategory.id}>
            <ItemContent>
              <ItemTitle>{productCategory.name}</ItemTitle>
              {productCategory.description && (
                <ItemDescription>{productCategory.description}</ItemDescription>
              )}
            </ItemContent>
            <ItemActions>
              <IsActiveDisplay value={productCategory.is_active} />
              <ProductCategoryActions category={productCategory} />
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
    ),
    [productCategories]
  )

  if (isPending) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
          <div className="h-10 w-24 bg-muted animate-pulse rounded" />
        </div>
        <TableSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error al cargar las categorías</p>
      </div>
    )
  }

  if (productCategories.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <ViewModeToggle
            resource="product-categories"
            onValueChange={setViewMode}
          />
        </div>
        <Empty>
          <EmptyHeader>
            <EmptyMedia>
              <Tag className="h-16 w-16" />
            </EmptyMedia>
            <EmptyTitle>No hay categorías</EmptyTitle>
            <EmptyDescription>
              No se encontraron categorías que coincidan con los filtros
              aplicados.
            </EmptyDescription>
            <div className="mt-4">
              <ProductCategoryCreateButton />
            </div>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <ViewModeToggle
          resource="product-categories"
          onValueChange={setViewMode}
        />
      </div>

      {viewMode === 'table' && (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup: HeaderGroup<ProductCategory>) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header: Header<ProductCategory, unknown>) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row: Row<ProductCategory>) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell: Cell<ProductCategory, unknown>) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No hay resultados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between px-2">
            <div className="flex-1 text-sm text-muted-foreground">
              Mostrando{' '}
              {Math.min(
                table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                  1,
                productCategories.length
              )}{' '}
              -{' '}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                productCategories.length
              )}{' '}
              de {productCategories.length} categorías
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {viewMode === 'cards' && renderCardsView()}
      {viewMode === 'list' && renderListView()}
    </div>
  )
}
