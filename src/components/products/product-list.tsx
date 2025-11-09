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
import { Card, CardContent } from '@/components/ui/card'
import { Database } from '@/types/supabase.types'
import { ProductActions } from './product-actions'
import { ProductCreateButton } from './product-create-button'
import { IsActiveDisplay } from '@/components/ui/is-active-field'
import { OrderByTableHeader } from '@/components/ui/order-by'
import { useOrderBy } from '@/components/ui/order-by'
import { OrderByConfig } from '@/components/ui/order-by'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from '@/components/ui/empty'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import {
  ArrowUpRightIcon,
  ChevronLeft,
  ChevronRight,
  Package,
} from 'lucide-react'
import useProductList from '@/hooks/products/use-products-list'
import {
  useFilters,
  FilterConfig,
  AppliedFilter,
} from '@/components/ui/filters'
import { useSearch } from '@/components/ui/search-input/use-search'
import { ViewModeToggle, ViewMode } from '@/components/ui/view-mode-toggle'
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
} from '@/components/ui/item'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { Pagination, usePagination } from '../ui/pagination'

type Product = Database['public']['Tables']['products']['Row']

export function ProductList({
  filterConfig,
  orderByConfig,
}: {
  filterConfig: FilterConfig[]
  orderByConfig: OrderByConfig
}) {
  // Estado para el modo de vista - inicializado con valor por defecto para evitar hydration mismatch
  const [viewMode, setViewMode] = useState<ViewMode>('table')

  // Usar el hook useFilters para obtener los filtros aplicados
  const { appliedFilters } = useFilters(filterConfig)
  const orderByHook = useOrderBy(orderByConfig)
  const { appliedSearch } = useSearch()
  const { appliedPagination, paginationProps } = usePagination()

  const productFilters: AppliedFilter[] = [
    ...appliedFilters,
    { field: 'is_service', operator: 'eq', value: false },
  ]
  const { data, isPending, error } = useProductList({
    filters: productFilters,
    search: appliedSearch,
    orders: orderByHook.appliedSorts,
    pagination: appliedPagination,
  })
  const products = data?.data || []

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
        <Card key={product.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 space-y-3">
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
          </CardContent>
        </Card>
      ))}
    </div>
  )

  // Función para renderizar vista de lista
  const renderListView = () => (
    <ItemGroup className="space-y-2">
      {products.map((product) => (
        <Item key={product.id} variant="outline">
          <ItemContent>
            <ItemTitle>{product.name}</ItemTitle>
            {product.sku && (
              <ItemDescription>SKU: {product.sku}</ItemDescription>
            )}
            <div className="flex gap-4 text-sm text-muted-foreground mt-2">
              {product.category_id && (
                <span>Categoría: {product.category_id}</span>
              )}
              {product.unit_id && <span>Unidad: {product.unit_id}</span>}
              <IsActiveDisplay value={product.is_active} />
            </div>
          </ItemContent>
          <ItemActions>
            <ProductActions product={product} />
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  )

  // Estados de carga y error
  if (isPending) {
    // Durante la carga inicial, usar 'table' para evitar hydration mismatch
    // Después de la hidratación, usar el viewMode del usuario
    return <TableSkeleton variant={viewMode} />
  }

  if (error) {
    return (
      <Alert>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Error al cargar productos: {error.message}
        </AlertDescription>
      </Alert>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center text-muted-foreground h-[calc(100vh-100px)]">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Package className="h-16 w-16" />
            </EmptyMedia>
            <EmptyTitle>No hay productos</EmptyTitle>
            <EmptyDescription>
              No se encontraron productos que coincidan con los filtros
              aplicados.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <ProductCreateButton>Crear Producto</ProductCreateButton>
              <Button variant="outline">Importar Producto</Button>
            </div>
          </EmptyContent>
          <Button
            variant="link"
            asChild
            className="text-muted-foreground"
            size="sm"
          >
            <a href="#">
              Saber Más <ArrowUpRightIcon />
            </a>
          </Button>
        </Empty>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controles de vista */}
      <div className="flex justify-end">
        <ViewModeToggle onValueChange={setViewMode} resource="products" />
      </div>

      {/* Contenido según la vista seleccionada */}
      {viewMode === 'table' && (
        <>
          <div>
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
      <div>
        <Pagination {...paginationProps} totalItems={data.total} />
      </div>
    </div>
  )
}
