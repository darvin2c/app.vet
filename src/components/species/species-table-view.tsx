'use client'

import { useState, useCallback, useEffect } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  HeaderGroup,
  Header,
  Row,
  Cell,
  getExpandedRowModel,
  ExpandedState,
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
import { IsActiveDisplay } from '@/components/ui/is-active-field'
import { OrderByTableHeader } from '@/components/ui/order-by'
import { useOrderBy } from '@/components/ui/order-by/use-order-by'
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import { BreedActions } from '@/components/breeds/breed-actions'

type Species = Tables<'species'>
type Breed = Tables<'breeds'>

// Tipo para las filas de la tabla jerárquica
type HierarchicalSpecies = Species & {
  subRows?: Breed[]
}

interface SpeciesTableViewProps {
  hierarchicalData: HierarchicalSpecies[]
  orderByHook: ReturnType<typeof useOrderBy>
  appliedSearch?: string
}

export function SpeciesTableView({
  hierarchicalData,
  orderByHook,
  appliedSearch,
}: SpeciesTableViewProps) {
  // Estado para filas expandidas en vista jerárquica
  const [expanded, setExpanded] = useState<ExpandedState>({})

  // Auto-expandir especies cuando se busca una raza
  useEffect(() => {
    if (appliedSearch) {
      const newExpanded: ExpandedState = {}
      hierarchicalData.forEach((speciesItem, index) => {
        if (speciesItem.subRows && speciesItem.subRows.length > 0) {
          // Verificar si alguna raza coincide con la búsqueda
          const hasMatchingBreed = speciesItem.subRows.some(
            (breed) =>
              breed.name.toLowerCase().includes(appliedSearch.toLowerCase()) ||
              (breed.description &&
                breed.description
                  .toLowerCase()
                  .includes(appliedSearch.toLowerCase()))
          )
          if (hasMatchingBreed) {
            newExpanded[index] = true
          }
        }
      })
      setExpanded(newExpanded)
    }
  }, [appliedSearch, hierarchicalData])

  const columns: ColumnDef<HierarchicalSpecies>[] = [
    {
      id: 'expander',
      header: '',
      cell: ({ row }) => {
        // Solo mostrar botón de expansión para especies (depth 0) que tienen razas activas
        if (row.depth === 0) {
          const hasActiveBreeds =
            row.original.subRows && row.original.subRows.length > 0

          if (hasActiveBreeds) {
            return (
              <button
                onClick={row.getToggleExpandedHandler()}
                className="p-1 hover:bg-muted rounded flex items-center justify-center transition-colors"
                aria-label={
                  row.getIsExpanded() ? 'Contraer razas' : 'Expandir razas'
                }
              >
                {row.getIsExpanded() ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            )
          }
        }

        return <div className="w-6" />
      },
      size: 40,
    },
    {
      accessorKey: 'name',
      header: ({ header }) => (
        <OrderByTableHeader field="name" orderByHook={orderByHook}>
          Nombre
        </OrderByTableHeader>
      ),
      cell: ({ row }) => {
        const isBreed = row.depth > 0
        const name = row.getValue('name') as string

        return (
          <div
            className={`font-medium ${
              isBreed ? 'ml-6 text-sm text-muted-foreground' : ''
            }`}
          >
            {name}
            {row.depth === 0 && row.original.subRows && (
              <span className="ml-2 text-xs text-muted-foreground">
                ({row.original.subRows.length} razas)
              </span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'description',
      header: ({ header }) => (
        <OrderByTableHeader field="description" orderByHook={orderByHook}>
          Descripción
        </OrderByTableHeader>
      ),
      cell: ({ row }) => {
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
      cell: ({ row }) => <IsActiveDisplay value={row.getValue('is_active')} />,
    },
    {
      accessorKey: 'created_at',
      header: ({ header }) => (
        <OrderByTableHeader field="created_at" orderByHook={orderByHook}>
          Fecha de Creación
        </OrderByTableHeader>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue('created_at'))
        return date.toLocaleDateString('es-ES')
      },
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const isBreed = row.depth > 0

        if (isBreed) {
          return <BreedActions breed={row.original as Breed} />
        } else {
          return <SpeciesActions species={row.original as Species} />
        }
      },
    },
  ]

  const table = useReactTable({
    data: hierarchicalData,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getSubRows: (row) => row.subRows,
    getRowCanExpand: (row) => {
      // Solo las especies (depth 0) con razas activas pueden expandirse
      return (
        row.depth === 0 &&
        !!(row.original.subRows && row.original.subRows.length > 0)
      )
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  const renderTableRow = useCallback(
    (row: Row<HierarchicalSpecies>) => (
      <TableRow
        key={row.id}
        data-state={row.getIsSelected() && 'selected'}
        className={row.depth > 0 ? 'bg-muted/30' : ''}
      >
        {row
          .getVisibleCells()
          .map((cell: Cell<HierarchicalSpecies, unknown>) => (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
      </TableRow>
    ),
    []
  )

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table
              .getHeaderGroups()
              .map((headerGroup: HeaderGroup<HierarchicalSpecies>) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(
                    (header: Header<HierarchicalSpecies, unknown>) => (
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
