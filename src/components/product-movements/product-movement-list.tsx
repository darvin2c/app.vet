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
import {
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
  Table as TableIcon,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Database } from '@/types/supabase.types'
import useProductMovements from '@/hooks/product-movements/use-product-movement-list'
import { ProductMovementActions } from './product-movement-actions'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

type ProductMovementWithProduct =
  Database['public']['Tables']['product_movements']['Row'] & {
    products?: {
      id: string
      name: string
      sku: string | null
      stock: number | null
      product_categories?: {
        id: string
        name: string
        code: string
      } | null
      product_units?: {
        id: string
        name: string | null
        abbreviation: string | null
      } | null
    } | null
  }

type ViewMode = 'table' | 'card' | 'list'

interface ProductMovementListProps {
  filters?: any
}

export function ProductMovementList({ filters }: ProductMovementListProps) {
  // Estado para controlar la vista actual
  const [viewMode, setViewMode] = useState<ViewMode>('table')

  // Usar el hook useProductMovements con los filtros aplicados
  const {
    data: movements = [],
    isLoading,
    error,
  } = useProductMovements(filters)

  const columns: ColumnDef<ProductMovementWithProduct>[] = [
    {
      accessorKey: 'created_at',
      header: 'Fecha',
      cell: ({ row }: { row: Row<ProductMovementWithProduct> }) => {
        const date = new Date(row.getValue('created_at'))
        return format(date, 'dd/MM/yyyy HH:mm', { locale: es })
      },
    },
    {
      accessorKey: 'products.name',
      header: 'Producto',
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
      header: 'Tipo',
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
      header: 'Cantidad',
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
      header: 'Costo Unit.',
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
        const totalCost = movement.unit_cost && movement.quantity ? movement.unit_cost * movement.quantity : null
        return totalCost ? `$${totalCost.toFixed(2)}` : '-'
      },
    },
    {
      accessorKey: 'reference',
      header: 'Referencia',
      cell: ({ row }: { row: Row<ProductMovementWithProduct> }) => {
        const ref = row.getValue('reference') as string | null
        return ref || '-'
      },
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }: { row: Row<ProductMovementWithProduct> }) => (
        <ProductMovementActions movement={row.original} />
      ),
    },
  ]

  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: movements,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  // Función para renderizar vista de tarjetas
  const renderCardView = useCallback(() => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {movements.map((movement: ProductMovementWithProduct) => (
          <Card key={movement.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-medium text-sm">
                    {movement.products?.name || 'N/A'}
                  </span>
                  {movement.products?.sku && (
                    <span className="text-xs text-muted-foreground">
                      SKU: {movement.products.sku}
                    </span>
                  )}
                </div>
                <ProductMovementActions movement={movement} />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Fecha:</span>
                <span className="text-sm">
                  {format(
                    new Date(movement.created_at),
                    'dd/MM/yyyy HH:mm',
                    { locale: es }
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tipo:</span>
                <Badge
                  variant={movement.quantity >= 0 ? 'default' : 'destructive'}
                >
                  {movement.source ||
                    (movement.quantity >= 0 ? 'ENTRADA' : 'SALIDA')}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cantidad:</span>
                <span
                  className={`text-sm font-medium ${movement.quantity >= 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {movement.quantity >= 0 ? '+' : ''}
                  {movement.quantity.toFixed(
                    0
                  )}{' '}
                  {movement.products?.product_units?.abbreviation || ''}
                </span>
              </div>
              {movement.unit_cost && movement.quantity && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Costo Total:
                  </span>
                  <span className="text-sm font-medium">
                    ${(movement.unit_cost * movement.quantity).toFixed(2)}
                  </span>
                </div>
              )}
              {movement.reference && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Referencia:
                  </span>
                  <span className="text-sm">{movement.reference}</span>
                </div>
              )}
              {movement.note && (
                <div className="pt-2 border-t">
                  <span className="text-xs text-muted-foreground">Nota:</span>
                  <p className="text-sm mt-1">{movement.note}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }, [movements])

  // Función para renderizar vista de lista
  const renderListView = useCallback(() => {
    return (
      <div className="space-y-2">
        {movements.map((movement: ProductMovementWithProduct) => (
          <Card key={movement.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {movement.products?.name || 'N/A'}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {format(
                        new Date(movement.created_at),
                        'dd/MM/yyyy HH:mm',
                        { locale: es }
                      )}
                    </span>
                  </div>
                  <Badge
                    variant={movement.quantity >= 0 ? 'default' : 'destructive'}
                  >
                    {movement.source ||
                      (movement.quantity >= 0 ? 'ENTRADA' : 'SALIDA')}
                  </Badge>
                  <span
                    className={`font-medium ${movement.quantity >= 0 ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {movement.quantity >= 0 ? '+' : ''}
                    {movement.quantity.toFixed(0)}{' '}
                    {movement.products?.product_units?.abbreviation || ''}
                  </span>
                  {movement.unit_cost && movement.quantity && (
                    <span className="text-sm font-medium">
                      ${(movement.unit_cost * movement.quantity).toFixed(2)}
                    </span>
                  )}
                </div>
                <ProductMovementActions movement={movement} />
              </div>
              {movement.note && (
                <p className="text-sm text-muted-foreground mt-2">
                  {movement.note}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }, [movements])

  // Estado de carga
  if (isLoading) {
    return <TableSkeleton />
  }

  // Estado de error
  if (error) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-destructive">
          Error al cargar movimientos: {error.message}
        </p>
      </div>
    )
  }

  if (movements.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No hay movimientos de productos</EmptyTitle>
          <EmptyDescription>
            No se encontraron movimientos de productos. Crea el primer
            movimiento para comenzar.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controles de vista */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {movements.length} movimiento{movements.length !== 1 ? 's' : ''}
          </span>
        </div>
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(value: string) =>
            value && setViewMode(value as ViewMode)
          }
        >
          <ToggleGroupItem value="table" aria-label="Vista de tabla">
            <TableIcon className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="card" aria-label="Vista de tarjetas">
            <Grid3X3 className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="Vista de lista">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Contenido según la vista seleccionada */}
      {viewMode === 'table' && (
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table
                  .getHeaderGroups()
                  .map(
                    (headerGroup: HeaderGroup<ProductMovementWithProduct>) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map(
                          (
                            header: Header<ProductMovementWithProduct, unknown>
                          ) => (
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
                    )
                  )}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table
                    .getRowModel()
                    .rows.map((row: Row<ProductMovementWithProduct>) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                      >
                        {row.getVisibleCells().map((cell) => (
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
                      No hay movimientos.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginación */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Página {table.getState().pagination.pageIndex + 1} de{' '}
              {table.getPageCount()}
            </div>
            <div className="space-x-2">
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
        </div>
      )}

      {viewMode === 'card' && renderCardView()}
      {viewMode === 'list' && renderListView()}
    </div>
  )
}
