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
import { ProductUnitActions } from './product-unit-actions'
import { IsActiveDisplay } from '@/components/ui/is-active-field'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import { ViewModeToggle, ViewMode } from '@/components/ui/view-mode-toggle'
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
} from '@/components/ui/item'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, Scale } from 'lucide-react'
import useProductUnits from '@/hooks/product-units/use-product-unit-list'

type ProductUnit = Database['public']['Tables']['product_units']['Row']

interface ProductUnitListProps {
  filters?: any
}

export function ProductUnitList({ filters }: ProductUnitListProps) {
  // Estado para controlar la vista actual
  const [viewMode, setViewMode] = useState<ViewMode>('table')

  // Usar el hook useProductUnits con los filtros aplicados
  const { data: units = [], isLoading, error } = useProductUnits(filters)

  const columns: ColumnDef<ProductUnit>[] = [
    {
      accessorKey: 'name',
      header: 'Nombre',
      cell: ({ row }: { row: Row<ProductUnit> }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'abbreviation',
      header: 'Abreviación',
      cell: ({ row }: { row: Row<ProductUnit> }) => (
        <div className="text-sm text-muted-foreground">
          {row.getValue('abbreviation')}
        </div>
      ),
    },
    {
      accessorKey: 'is_active',
      header: 'Estado',
      cell: ({ row }: { row: Row<ProductUnit> }) => (
        <IsActiveDisplay value={row.getValue('is_active')} />
      ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }: { row: Row<ProductUnit> }) => (
        <ProductUnitActions unit={row.original} />
      ),
    },
  ]

  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: units,
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
    (headerGroup: HeaderGroup<ProductUnit>) => (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map((header: Header<ProductUnit, unknown>) => (
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
    (row: Row<ProductUnit>) => (
      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
        {row.getVisibleCells().map((cell: Cell<ProductUnit, unknown>) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ),
    []
  )

  const renderTableView = useCallback(
    () => (
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
    ),
    [table, columns.length, renderTableHeader, renderTableRow]
  )

  const renderCardsView = useCallback(
    () => (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {units.map((unit) => (
          <Card key={unit.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{unit.name}</CardTitle>
              <ProductUnitActions unit={unit} />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Abreviación: {unit.abbreviation}
                </p>
                <div className="flex justify-between items-center">
                  <IsActiveDisplay value={unit.is_active} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    ),
    [units]
  )

  const renderListView = useCallback(
    () => (
      <ItemGroup>
        {units.map((unit) => (
          <Item key={unit.id}>
            <ItemContent>
              <ItemTitle>{unit.name}</ItemTitle>
              <ItemDescription>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    Abreviación: {unit.abbreviation}
                  </div>
                  <div className="flex items-center gap-2">
                    <IsActiveDisplay value={unit.is_active} />
                  </div>
                </div>
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <ProductUnitActions unit={unit} />
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
    ),
    [units]
  )

  if (isLoading) {
    return <TableSkeleton variant={viewMode} />
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error al cargar las unidades</p>
      </div>
    )
  }

  if (units.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <Scale className="h-8 w-8" />
          </EmptyMedia>
          <EmptyTitle>No hay unidades</EmptyTitle>
          <EmptyDescription>
            Comienza creando tu primera unidad de producto.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controles de vista */}
      <div className="flex justify-end">
        <ViewModeToggle onValueChange={setViewMode} resource="product-units" />
      </div>

      {/* Contenido según la vista seleccionada */}
      {viewMode === 'table' && renderTableView()}
      {viewMode === 'cards' && renderCardsView()}
      {viewMode === 'list' && renderListView()}

      {/* Paginación */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{' '}
          {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Filas por página</p>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value))
              }}
              className="h-8 w-[70px] rounded border border-input bg-background px-3 py-1 text-sm"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Página {table.getState().pagination.pageIndex + 1} de{' '}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Ir a la página anterior</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Ir a la página siguiente</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
