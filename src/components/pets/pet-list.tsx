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
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { PetActions } from './pet-actions'
import { PetCreateButton } from './pet-create-button'
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
import { ChevronLeft, ChevronRight, PawPrint } from 'lucide-react'
import { usePets } from '@/hooks/pets/use-pet-list'
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
import { Tables } from '@/types/supabase.types'

type Pet = Tables<'pets'> & {
  customers: Tables<'customers'> | null
  species: Tables<'species'> | null
  breeds: Tables<'breeds'> | null
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

  const columns: ColumnDef<Pet>[] = [
    {
      accessorKey: 'name',
      header: ({ header }) => (
        <OrderByTableHeader field="name" orderByHook={orderByHook}>
          Nombre
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Pet> }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'customers',
      header: ({ header }) => (
        <OrderByTableHeader field="client_id" orderByHook={orderByHook}>
          Cliente
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Pet> }) => {
        const pet = row.original
        return (
          <div className="text-sm">
            {pet.customers
              ? `${pet.customers.first_name} ${pet.customers.last_name}`
              : 'Sin cliente'}
          </div>
        )
      },
    },
    {
      accessorKey: 'species',
      header: ({ header }) => (
        <OrderByTableHeader field="species_id" orderByHook={orderByHook}>
          Especie
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Pet> }) => {
        const pet = row.original
        return (
          <div className="text-sm text-muted-foreground">
            {pet.species?.name || '-'}
          </div>
        )
      },
    },
    {
      accessorKey: 'breeds',
      header: ({ header }) => (
        <OrderByTableHeader field="breed_id" orderByHook={orderByHook}>
          Raza
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Pet> }) => {
        const pet = row.original
        return (
          <div className="text-sm text-muted-foreground">
            {pet.breeds?.name || '-'}
          </div>
        )
      },
    },
    {
      accessorKey: 'sex',
      header: 'Sexo',
      cell: ({ row }: { row: Row<Pet> }) => {
        const sex = row.getValue('sex') as string
        return (
          <Badge variant={sex === 'M' ? 'default' : 'secondary'}>
            {sex === 'M' ? 'Macho' : 'Hembra'}
          </Badge>
        )
      },
    },

    {
      id: 'actions',
      cell: ({ row }: { row: Row<Pet> }) => <PetActions pet={row.original} />,
    },
  ]

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
        <div key={pet.id} className="border rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{pet.name}</h3>
              <p className="text-sm text-muted-foreground">
                Cliente:{' '}
                {pet.customers
                  ? `${pet.customers.first_name} ${pet.customers.last_name}`
                  : 'Sin cliente'}
              </p>
            </div>
            <PetActions pet={pet} />
          </div>

          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-muted-foreground">Especie:</span>{' '}
              {pet.species?.name || '-'}
            </div>
            {pet.breeds && (
              <div className="text-sm">
                <span className="text-muted-foreground">Raza:</span>{' '}
                {pet.breeds.name}
              </div>
            )}
            <div className="text-sm">
              <span className="text-muted-foreground">Sexo:</span>{' '}
              <Badge
                variant={pet.sex === 'M' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {pet.sex === 'M' ? 'Macho' : 'Hembra'}
              </Badge>
            </div>
            {pet.birth_date && (
              <div className="text-sm">
                <span className="text-muted-foreground">Nacimiento:</span>{' '}
                {format(new Date(pet.birth_date), 'dd/MM/yyyy', { locale: es })}
              </div>
            )}
            {pet.weight && (
              <div className="text-sm">
                <span className="text-muted-foreground">Peso:</span>{' '}
                {pet.weight} kg
              </div>
            )}
          </div>

          <div className="flex justify-between items-center"></div>
        </div>
      ))}
    </div>
  )

  // Función para renderizar vista de lista
  const renderListView = () => (
    <ItemGroup className="space-y-2">
      {pets.map((pet) => (
        <Item key={pet.id} variant="outline">
          <ItemContent>
            <ItemTitle>{pet.name}</ItemTitle>
            <ItemDescription>
              Cliente:{' '}
              {pet.customers
                ? `${pet.customers.first_name} ${pet.customers.last_name}`
                : 'Sin cliente'}
            </ItemDescription>
            <div className="flex gap-4 text-sm text-muted-foreground mt-2">
              <span>Especie: {pet.species?.name || '-'}</span>
              {pet.breeds && <span>Raza: {pet.breeds.name}</span>}
              <Badge
                variant={pet.sex === 'M' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {pet.sex === 'M' ? 'Macho' : 'Hembra'}
              </Badge>
            </div>
          </ItemContent>
          <ItemActions>
            <PetActions pet={pet} />
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  )

  // Estados de carga y error
  if (isPending) {
    return <TableSkeleton variant={viewMode} />
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">
          Error al cargar mascotas: {error.message}
        </p>
      </div>
    )
  }

  if (pets.length === 0) {
    return (
      <div className="flex items-center justify-center text-muted-foreground h-[calc(100vh-100px)]">
        <Empty>
          <EmptyHeader>
            <EmptyMedia>
              <PawPrint className="h-16 w-16" />
            </EmptyMedia>
            <EmptyTitle>No hay mascotas</EmptyTitle>
            <EmptyDescription>
              No se encontraron mascotas que coincidan con los filtros
              aplicados.
            </EmptyDescription>
            <div className="mt-4">
              <PetCreateButton children="Nueva Mascota" />
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
        <ViewModeToggle onValueChange={setViewMode} resource="pets" />
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
                pets.length
              )}{' '}
              de {pets.length} mascotas
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
