'use client'

import { useState, useCallback } from 'react'
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
import { ProductActions } from './product-actions'
import { ProductCreateButton } from './product-create-button'
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
import {
  ChevronLeft,
  ChevronRight,
  Package,
  Table2,
  Grid3X3,
  List,
} from 'lucide-react'
import useProducts from '@/hooks/products/use-products-list'
import { useFilters } from '@/hooks/use-filters'
import { FilterConfig } from '@/types/filters.types'
import { useSearch } from '@/hooks/use-search'

type ViewMode = 'table' | 'cards' | 'list'

type Product = Database['public']['Tables']['products']['Row']

export function ProductList({
  filterConfig,
  orderByConfig,
}: {
  filterConfig: FilterConfig[]
  orderByConfig: OrderByConfig
}) {
  // Estado para controlar la vista actual
  const [viewMode, setViewMode] = useState<ViewMode>('table')

  // Usar el hook useFilters para obtener los filtros aplicados
  const { appliedFilters } = useFilters(filterConfig)
  const orderByHook = useOrderBy(orderByConfig)
  const { appliedSearch } = useSearch()
  // Usar el hook useProducts con los filtros aplicados (sin componentes React)
  console.log(appliedFilters, orderByHook.appliedSorts, appliedSearch)
  const {
    data: products = [],
    isPending,
    error,
  } = useProducts({
    filters: appliedFilters,
    search: appliedSearch,
    orders: orderByHook.appliedSorts,
  })

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'name',
      header: ({ header }) => (
        <OrderByTableHeader field="name" orderByHook={orderByHook}>
          Nombre
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Product> }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'sku',
      header: ({ header }) => (
        <OrderByTableHeader field="sku" orderByHook={orderByHook}>
          SKU
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Product> }) => (
        <div className="text-sm text-muted-foreground">
          {row.getValue('sku') || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'category_id',
      header: ({ header }) => (
        <OrderByTableHeader field="category_id" orderByHook={orderByHook}>
          Categoría
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Product> }) => (
        <div className="text-sm text-muted-foreground">
          {row.getValue('category_id') || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'unit_id',
      header: ({ header }) => (
        <OrderByTableHeader field="unit_id" orderByHook={orderByHook}>
          Unidad
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Product> }) => (
        <div className="text-sm text-muted-foreground">
          {row.getValue('unit_id') || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'is_active',
      header: ({ header }) => (
        <OrderByTableHeader field="is_active" orderByHook={orderByHook}>
          Estado
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Product> }) => (
        <IsActiveDisplay value={row.getValue('is_active')} />
      ),
    },
    {
      id: 'actions',
      cell: ({ row }: { row: Row<Product> }) => (
        <ProductActions product={row.original} />
      ),
    },
  ]

  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: products,
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

  // Función para renderizar el encabezado de la tabla
  const renderTableHeader = useCallback(
    (headerGroup: HeaderGroup<Product>) => (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map((header: Header<Product, unknown>) => (
          <TableHead key={header.id}>
            {header.isPlaceholder
              ? null
              : flexRender(header.column.columnDef.header, header.getContext())}
          </TableHead>
        ))}
      </TableRow>
    ),
    []
  )

  // Función para renderizar las filas de la tabla
  const renderTableRow = useCallback(
    (row: Row<Product>) => (
      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
        {row.getVisibleCells().map((cell: Cell<Product, unknown>) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ),
    []
  )

  // Función para renderizar vista de tarjetas
  const renderCardsView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{product.name}</h3>
              {product.sku && (
                <p className="text-sm text-muted-foreground">
                  SKU: {product.sku}
                </p>
              )}
            </div>
            <ProductActions product={product} />
          </div>

          <div className="space-y-2">
            {product.category_id && (
              <div className="text-sm">
                <span className="text-muted-foreground">Categoría:</span>{' '}
                {product.category_id}
              </div>
            )}
            {product.unit_id && (
              <div className="text-sm">
                <span className="text-muted-foreground">Unidad:</span>{' '}
                {product.unit_id}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <IsActiveDisplay value={product.is_active} />
          </div>
        </div>
      ))}
    </div>
  )

  // Función para renderizar vista de lista
  const renderListView = () => (
    <div className="space-y-2">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="font-medium">{product.name}</h3>
                  {product.sku && (
                    <p className="text-sm text-muted-foreground">
                      SKU: {product.sku}
                    </p>
                  )}
                </div>

                <div className="flex gap-4 text-sm text-muted-foreground">
                  {product.category_id && (
                    <span>Categoría: {product.category_id}</span>
                  )}
                  {product.unit_id && <span>Unidad: {product.unit_id}</span>}
                </div>

                <IsActiveDisplay value={product.is_active} />
              </div>
            </div>
            <ProductActions product={product} />
          </div>
        </div>
      ))}
    </div>
  )

  // Estados de carga y error
  if (isPending) {
    return <TableSkeleton />
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">
          Error al cargar productos: {error.message}
        </p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center text-muted-foreground h-[calc(100vh-100px)]">
        <Empty>
          <EmptyHeader>
            <EmptyMedia>
              <Package className="h-16 w-16" />
            </EmptyMedia>
            <EmptyTitle>No hay productos</EmptyTitle>
            <EmptyDescription>
              No se encontraron productos que coincidan con los filtros
              aplicados.
            </EmptyDescription>
            <div className="mt-4">
              <ProductCreateButton children="Nuevo Producto" />
            </div>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controles de vista */}
      <div className="flex justify-end">
        <div className="flex border rounded-lg">
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('table')}
            className="rounded-r-none"
          >
            <Table2 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'cards' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('cards')}
            className="rounded-none border-x"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="rounded-l-none"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Contenido según la vista seleccionada */}
      {viewMode === 'table' && (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map(renderTableHeader)}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map(renderTableRow)
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

          {/* Paginación */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Mostrando{' '}
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}{' '}
              a{' '}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                products.length
              )}{' '}
              de {products.length} productos
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
