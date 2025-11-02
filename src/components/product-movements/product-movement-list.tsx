'use client'

import { useCallback, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  ArrowUpRightIcon,
  ChevronLeft,
  ChevronRight,
  Package,
} from 'lucide-react'
import {
  type ColumnDef,
  type Row,
  type Header,
  type HeaderGroup,
  type Cell,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import { ViewModeToggle, type ViewMode } from '@/components/ui/view-mode-toggle'
import { OrderByTableHeader } from '@/components/ui/order-by'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from '@/components/ui/empty'
import {
  ItemGroup,
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from '@/components/ui/item'

import useProductMovementList, {
  type ProductMovementWithProduct,
} from '@/hooks/product-movements/use-product-movement-list'
import { ProductMovementActions } from './product-movement-actions'
import { ProductMovementCreateButton } from './product-movement-create-button'
import { useFilters } from '@/hooks/use-filters'
import { useSearch } from '@/hooks/use-search'
import { useOrderBy } from '@/components/ui/order-by/use-order-by'
import type { FilterConfig } from '@/types/filters.types'
import type { OrderByConfig } from '@/components/ui/order-by/order-by.types'

export function ProductMovementList({
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

  // Obtener datos usando los hooks
  const {
    data: movements = [],
    isLoading,
    error,
  } = useProductMovementList({
    search: appliedSearch,
    ...appliedFilters.reduce((acc, filter) => {
      acc[filter.field] = filter.value
      return acc
    }, {} as any),
  })

  const columns: ColumnDef<ProductMovementWithProduct>[] = [
    {
      accessorKey: 'created_at',
      header: ({ header }) => (
        <OrderByTableHeader field="created_at" orderByHook={orderByHook}>
          Fecha
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<ProductMovementWithProduct> }) => {
        const date = new Date(row.getValue('created_at'))
        return format(date, 'dd/MM/yyyy HH:mm', { locale: es })
      },
    },
    {
      accessorKey: 'products.name',
      header: ({ header }) => (
        <OrderByTableHeader field="products.name" orderByHook={orderByHook}>
          Producto
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<ProductMovementWithProduct> }) => {
        const movement = row.original
        return (
          <div className="flex flex-col">
            <span className="font-medium">
              {movement.products?.name || 'N/A'}
            </span>
            <span className="text-sm text-muted-foreground">
              {movement.products?.sku || 'Sin SKU'}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: 'source',
      header: ({ header }) => (
        <OrderByTableHeader field="source" orderByHook={orderByHook}>
          Tipo
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<ProductMovementWithProduct> }) => {
        const type = row.getValue('source') as string
        const quantity = row.original.quantity

        let variant: 'default' | 'secondary' | 'destructive' | 'outline' =
          'default'
        let displayType = type || 'MOVIMIENTO'

        if (quantity > 0) {
          variant = 'default' // Verde para entradas
          displayType = type || 'ENTRADA'
        } else if (quantity < 0) {
          variant = 'destructive' // Rojo para salidas
          displayType = type || 'SALIDA'
        } else {
          variant = 'secondary' // Gris para ajustes
          displayType = type || 'AJUSTE'
        }

        return <Badge variant={variant}>{displayType}</Badge>
      },
    },
    {
      accessorKey: 'quantity',
      header: ({ header }) => (
        <OrderByTableHeader field="quantity" orderByHook={orderByHook}>
          Cantidad
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<ProductMovementWithProduct> }) => {
        const quantity = row.getValue('quantity') as number
        const unit = row.original.products?.product_units

        return (
          <div
            className={`font-medium ${quantity >= 0 ? 'text-green-600' : 'text-red-600'}`}
          >
            {quantity >= 0 ? '+' : ''}
            {quantity.toFixed(0)} {unit?.abbreviation || ''}
          </div>
        )
      },
    },
    {
      accessorKey: 'unit_cost',
      header: ({ header }) => (
        <OrderByTableHeader field="unit_cost" orderByHook={orderByHook}>
          Costo Unit.
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<ProductMovementWithProduct> }) => {
        const cost = row.getValue('unit_cost') as number | null
        return cost ? `$${cost.toFixed(2)}` : '-'
      },
    },
    {
      id: 'total_cost',
      header: 'Costo Total',
      cell: ({ row }: { row: Row<ProductMovementWithProduct> }) => {
        const movement = row.original
        const totalCost =
          movement.unit_cost && movement.quantity
            ? movement.unit_cost * movement.quantity
            : null
        return totalCost ? `$${totalCost.toFixed(2)}` : '-'
      },
    },
    {
      accessorKey: 'reference',
      header: ({ header }) => (
        <OrderByTableHeader field="reference" orderByHook={orderByHook}>
          Referencia
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<ProductMovementWithProduct> }) => {
        const ref = row.getValue('reference') as string | null
        return ref || '-'
      },
    },
    {
      id: 'actions',
      cell: ({ row }: { row: Row<ProductMovementWithProduct> }) => (
        <ProductMovementActions movement={row.original} />
      ),
    },
  ]

  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: movements,
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
    (headerGroup: HeaderGroup<ProductMovementWithProduct>) => (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map(
          (header: Header<ProductMovementWithProduct, unknown>) => (
            <TableHead key={header.id}>
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
            </TableHead>
          )
        )}
      </TableRow>
    ),
    []
  )

  // Función para renderizar las filas de la tabla
  const renderTableRow = useCallback(
    (row: Row<ProductMovementWithProduct>) => (
      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
        {row
          .getVisibleCells()
          .map((cell: Cell<ProductMovementWithProduct, unknown>) => (
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
      {movements.map((movement: ProductMovementWithProduct) => (
        <Card key={movement.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">
                  {movement.products?.name || 'N/A'}
                </h3>
                {movement.products?.sku && (
                  <p className="text-sm text-muted-foreground">
                    SKU: {movement.products.sku}
                  </p>
                )}
              </div>
              <ProductMovementActions movement={movement} />
            </div>

            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-muted-foreground">Fecha:</span>{' '}
                {format(new Date(movement.created_at), 'dd/MM/yyyy HH:mm', {
                  locale: es,
                })}
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Tipo:</span>{' '}
                <Badge
                  variant={movement.quantity >= 0 ? 'default' : 'destructive'}
                >
                  {movement.source ||
                    (movement.quantity >= 0 ? 'ENTRADA' : 'SALIDA')}
                </Badge>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Cantidad:</span>{' '}
                <span
                  className={`font-medium ${movement.quantity >= 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {movement.quantity >= 0 ? '+' : ''}
                  {movement.quantity.toFixed(0)}{' '}
                  {movement.products?.product_units?.abbreviation || ''}
                </span>
              </div>
              {movement.unit_cost && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Costo Unit.:</span> $
                  {movement.unit_cost.toFixed(2)}
                </div>
              )}
              {movement.reference && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Referencia:</span>{' '}
                  {movement.reference}
                </div>
              )}
            </div>

            {movement.note && (
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">{movement.note}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )

  // Función para renderizar vista de lista
  const renderListView = () => (
    <ItemGroup className="space-y-2">
      {movements.map((movement: ProductMovementWithProduct) => (
        <Item key={movement.id} variant="outline">
          <ItemContent>
            <ItemTitle>
              {movement.products?.name || 'Producto no encontrado'}
            </ItemTitle>
            <ItemDescription>
              {movement.source ||
                (movement.quantity >= 0 ? 'ENTRADA' : 'SALIDA')}{' '}
              - Cantidad: {movement.quantity}
            </ItemDescription>
            <div className="flex gap-4 text-sm text-muted-foreground mt-2">
              <span>
                Fecha:{' '}
                {format(new Date(movement.created_at), 'dd/MM/yyyy HH:mm', {
                  locale: es,
                })}
              </span>
              {movement.note && <span>Nota: {movement.note}</span>}
              {movement.reference && (
                <span>Referencia: {movement.reference}</span>
              )}
            </div>
          </ItemContent>
          <ItemActions>
            <ProductMovementActions movement={movement} />
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  )

  // Estados de carga y error
  if (isLoading) {
    // Durante la carga inicial, usar 'table' para evitar hydration mismatch
    // Después de la hidratación, usar el viewMode del usuario
    return <TableSkeleton variant={viewMode} />
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">
          Error al cargar movimientos: {error.message}
        </p>
      </div>
    )
  }

  if (movements.length === 0) {
    return (
      <div className="flex items-center justify-center text-muted-foreground h-[calc(100vh-100px)]">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Package className="h-16 w-16" />
            </EmptyMedia>
            <EmptyTitle>No hay movimientos</EmptyTitle>
            <EmptyDescription>
              No se encontraron movimientos que coincidan con los filtros
              aplicados.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <ProductMovementCreateButton isResponsive={false}>
                Crear Movimiento
              </ProductMovementCreateButton>
              <Button variant="outline">Importar Movimiento</Button>
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
        <ViewModeToggle
          onValueChange={setViewMode}
          resource="product-movements"
        />
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
                movements.length
              )}{' '}
              de {movements.length} movimientos
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
