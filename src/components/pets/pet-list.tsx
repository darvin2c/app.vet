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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
import { ViewModeToggle, ViewMode } from '@/components/ui/view-mode-toggle'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { usePets } from '@/hooks/pets/use-pet-list'
import { useFilters } from '@/hooks/use-filters'
import { useOrderBy } from '@/hooks/use-order-by'
import { useSearch } from '@/hooks/use-search'
import { FilterConfig } from '@/types/filters.types'
import { OrderByConfig } from '@/types/order-by.types'
import { Tables, Database } from '@/types/supabase.types'
import { getPetTableColumns } from './pet-table-columns'
import { PetActions } from './pet-actions'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
} from '@/components/ui/item'

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

type Pet = Tables<'pets'> & {
  customers: Tables<'customers'> | null
  breeds: Tables<'breeds'> | null
  species: Tables<'species'> | null
}

export function PetList({
  filterConfig,
  orderByConfig,
}: {
  filterConfig: FilterConfig[]
  orderByConfig: OrderByConfig
}) {
  // Estado para el modo de vista - inicializado con valor por defecto para evitar hydration mismatch
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [isHydrated, setIsHydrated] = useState(false)

  // Usar el hook useFilters para obtener los filtros aplicados
  const { appliedFilters } = useFilters(filterConfig)
  const orderByHook = useOrderBy(orderByConfig)
  const { appliedSearch } = useSearch()

  // Usar el hook usePets con los filtros aplicados
  console.log(appliedFilters, orderByHook.appliedSorts, appliedSearch)
  const {
    data: pets = [],
    isPending,
    error,
  } = usePets({
    filters: appliedFilters,
    search: appliedSearch,
    orders: orderByHook.appliedSorts,
  })

  // Efecto para sincronizar con localStorage después de la hidratación
  useEffect(() => {
    const storedViewMode = getStoredViewMode('pets')
    setViewMode(storedViewMode)
    setIsHydrated(true)
  }, [])

  const columns = getPetTableColumns(orderByHook)

  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: pets,
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
    (headerGroup: HeaderGroup<Pet>) => (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map((header: Header<Pet, unknown>) => (
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
    (row: Row<Pet>) => (
      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
        {row.getVisibleCells().map((cell: Cell<Pet, unknown>) => (
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
      {pets.map((pet) => (
        <Card key={pet.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-lg">{pet.name}</CardTitle>
                <Badge variant={pet.sex === 'M' ? 'default' : 'secondary'}>
                  {pet.sex === 'M' ? 'Macho' : 'Hembra'}
                </Badge>
              </div>
              <PetActions pet={pet} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">
                  Cliente:
                </span>
                <p className="mt-1">
                  {pet.customers ? `${pet.customers.first_name} ${pet.customers.last_name}` : 'Sin cliente'}
                </p>
              </div>

              <div>
                <span className="font-medium text-muted-foreground">
                  Especie:
                </span>
                <p className="mt-1">{pet.species?.name || '-'}</p>
              </div>

              {pet.breeds && (
                <div>
                  <span className="font-medium text-muted-foreground">
                    Raza:
                  </span>
                  <p className="mt-1">{pet.breeds.name}</p>
                </div>
              )}

              {pet.birth_date && (
                <div>
                  <span className="font-medium text-muted-foreground">
                    Fecha de Nacimiento:
                  </span>
                  <p className="mt-1">
                    {format(new Date(pet.birth_date), 'dd/MM/yyyy', {
                      locale: es,
                    })}
                  </p>
                </div>
              )}

              {pet.weight && (
                <div>
                  <span className="font-medium text-muted-foreground">
                    Peso:
                  </span>
                  <p className="mt-1">{pet.weight} kg</p>
                </div>
              )}

              {pet.microchip && (
                <div>
                  <span className="font-medium text-muted-foreground">
                    Microchip:
                  </span>
                  <p className="mt-1 font-mono text-xs">{pet.microchip}</p>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-between items-center">
              <Badge variant="secondary">Activo</Badge>
              <span className="text-xs text-muted-foreground">
                {format(new Date(pet.created_at), 'dd/MM/yyyy', { locale: es })}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  // Función para renderizar vista de lista
  const renderListView = () => (
    <ItemGroup>
      {pets.map((pet) => (
        <Item key={pet.id} variant="outline">
          <ItemContent>
            <div className="flex items-center justify-between w-full">
              <div className="flex-1">
                <ItemTitle>{pet.name}</ItemTitle>
                <ItemDescription>
                  <div className="flex items-center gap-4 text-sm">
                    <span>
                      Cliente: {pet.customers ? `${pet.customers.first_name} ${pet.customers.last_name}` : 'Sin cliente'}
                    </span>
                    <span>Especie: {pet.species?.name || '-'}</span>
                    {pet.breeds && <span>Raza: {pet.breeds.name}</span>}
                    <Badge
                      variant={pet.sex === 'M' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {pet.sex === 'M' ? 'Macho' : 'Hembra'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                    {pet.birth_date && (
                      <span>
                        Nacimiento:{' '}
                        {format(new Date(pet.birth_date), 'dd/MM/yyyy', {
                          locale: es,
                        })}
                      </span>
                    )}
                    {pet.weight && <span>Peso: {pet.weight} kg</span>}
                    {pet.microchip && <span>Microchip: {pet.microchip}</span>}
                    <Badge variant="secondary">Activo</Badge>
                  </div>
                </ItemDescription>
              </div>
              <ItemActions>
                <PetActions pet={pet} />
              </ItemActions>
            </div>
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  )

  if (isPending) {
    return <TableSkeleton variant={!isHydrated ? 'table' : viewMode} />
  }

  if (!pets || pets.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <ViewModeToggle resource="pets" onValueChange={setViewMode} />
        </div>
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No hay mascotas</EmptyTitle>
            <EmptyDescription>
              No se encontraron mascotas con los filtros aplicados.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ViewModeToggle resource="pets" onValueChange={setViewMode} />
      </div>

      {viewMode === 'table' && (
        <div className="space-y-4">
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
          <div className="flex items-center justify-between px-2">
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
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Ir a la primera página</span>
                  {'<<'}
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Ir a la página anterior</span>
                  {'<'}
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Ir a la página siguiente</span>
                  {'>'}
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Ir a la última página</span>
                  {'>>'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'cards' && renderCardsView()}

      {viewMode === 'list' && renderListView()}
    </div>
  )
}
