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
import { Tables } from '@/types/supabase.types'
import { SpeciesActions } from './species-actions'
import { SpeciesCreateButton } from './species-create-button'
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
import { ChevronLeft, ChevronRight, Stethoscope } from 'lucide-react'
import { useSpeciesList } from '@/hooks/species/use-species-list'
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

type Species = Tables<'species'>

export function SpeciesList({
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

  const {
    data: species = [],
    isPending,
    error,
  } = useSpeciesList({
    filters: appliedFilters,
    search: appliedSearch,
    orders: orderByHook.appliedSorts,
  })

  const columns: ColumnDef<Species>[] = [
    {
      accessorKey: 'name',
      header: ({ header }) => (
        <OrderByTableHeader field="name" orderByHook={orderByHook}>
          Nombre
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Species> }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'description',
      header: ({ header }) => (
        <OrderByTableHeader field="description" orderByHook={orderByHook}>
          Descripción
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Species> }) => {
        const description = row.getValue('description') as string
        return description || '-'
      },
    },
    {
      accessorKey: 'is_active',
      header: ({ header }) => (
        <OrderByTableHeader field="is_active" orderByHook={orderByHook}>
          Estado
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Species> }) => (
        <IsActiveDisplay value={row.getValue('is_active')} />
      ),
    },
    {
      accessorKey: 'created_at',
      header: ({ header }) => (
        <OrderByTableHeader field="created_at" orderByHook={orderByHook}>
          Fecha de Creación
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Species> }) => {
        const date = new Date(row.getValue('created_at'))
        return date.toLocaleDateString('es-ES')
      },
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }: { row: Row<Species> }) => (
        <SpeciesActions species={row.original} />
      ),
    },
  ]

  const table = useReactTable({
    data: species,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  const renderTableRow = useCallback(
    (row: Row<Species>) => (
      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
        {row.getVisibleCells().map((cell: Cell<Species, unknown>) => (
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
            {table
              .getHeaderGroups()
              .map((headerGroup: HeaderGroup<Species>) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(
                    (header: Header<Species, unknown>) => (
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
              ))}
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
                  No hay especies registradas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    ),
    [table, columns.length, renderTableRow]
  )

  const renderListView = useCallback(
    () => (
      <ItemGroup>
        {species.map((speciesItem) => (
          <Item key={speciesItem.id}>
            <ItemContent>
              <ItemTitle>{speciesItem.name}</ItemTitle>
              <ItemDescription>
                <div className="space-y-1">
                  {speciesItem.description && (
                    <p className="text-sm text-muted-foreground">
                      {speciesItem.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-xs">Estado:</span>
                    <IsActiveDisplay value={speciesItem.is_active} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Creado:{' '}
                    {new Date(speciesItem.created_at).toLocaleDateString(
                      'es-ES'
                    )}
                  </p>
                </div>
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <SpeciesActions species={speciesItem} />
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
    ),
    [species]
  )

  if (isPending) {
    return <TableSkeleton />
  }

  if (error) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <Stethoscope className="h-8 w-8" />
          </EmptyMedia>
          <EmptyTitle>Error al cargar especies</EmptyTitle>
          <EmptyDescription>
            Ocurrió un error al cargar las especies. Por favor, intenta
            nuevamente.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (species.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <Stethoscope className="h-8 w-8" />
          </EmptyMedia>
          <EmptyTitle>No hay especies registradas</EmptyTitle>
          <EmptyDescription>
            Comienza agregando tu primera especie para organizar las razas de
            animales.
          </EmptyDescription>
        </EmptyHeader>
        <SpeciesCreateButton />
      </Empty>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ViewModeToggle onValueChange={setViewMode} resource="species" />
        </div>
      </div>

      {viewMode === 'table' && renderTableView()}
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
