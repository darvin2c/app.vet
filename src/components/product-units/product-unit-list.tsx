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
import {
  ChevronLeft,
  ChevronRight,
  Scale,
  Table2,
  Grid3X3,
  List,
} from 'lucide-react'
import useProductUnits from '@/hooks/product-units/use-product-units'

type ViewMode = 'table' | 'cards' | 'list'

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

  // Función para renderizar vista de tarjetas
  const renderCardsView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {units.map((unit) => (
        <div key={unit.id} className="border rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{unit.name}</h3>
              <p className="text-sm text-muted-foreground">
                Abreviación: {unit.abbreviation}
              </p>
            </div>
            <ProductUnitActions unit={unit} />
          </div>

          <div className="flex justify-between items-center">
            <IsActiveDisplay value={unit.is_active} />
          </div>
        </div>
      ))}
    </div>
  )

  // Función para renderizar vista de lista
  const renderListView = () => (
    <div className="space-y-2">
      {units.map((unit) => (
        <div key={unit.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="font-medium">{unit.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Abreviación: {unit.abbreviation}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <IsActiveDisplay value={unit.is_active} />
              <ProductUnitActions unit={unit} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  // Estados de carga y error
  if (isLoading) {
    return <TableSkeleton />
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
        <div className="flex border rounded-md">
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
            className="rounded-none"
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
      )}

      {viewMode === 'cards' && renderCardsView()}
      {viewMode === 'list' && renderListView()}

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
            units.length
          )}{' '}
          de {units.length} unidades
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
  )
}
