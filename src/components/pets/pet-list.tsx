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
import { ViewModeToggle, ViewMode } from '@/components/ui/view-mode-toggle'
import { useSearch } from '@/components/ui/search-input/use-search'
import { useOrderBy } from '@/components/ui/order-by/use-order-by'
import { useFilters, FilterConfig } from '@/components/ui/filters'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import { OrderByTableHeader } from '@/components/ui/order-by'
import { OrderByConfig } from '@/components/ui/order-by'
import { Card, CardContent } from '@/components/ui/card'
import { PetCreateButton } from './pet-create-button'
import { Tables } from '@/types/supabase.types'
import { Pagination, usePagination } from '../ui/pagination'
import { Badge } from '@/components/ui/badge'
import { PetActions } from './pet-actions'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { PawPrint } from 'lucide-react'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
} from '@/components/ui/item'
import { usePetList } from '@/hooks/pets/use-pet-list'

// Ajuste de tipo de fila para coincidir con el select del hook
type PetRow = Tables<'pets'> & {
  customers: Pick<
    Tables<'customers'>,
    'id' | 'first_name' | 'last_name' | 'email' | 'phone'
  > | null
  species: Pick<Tables<'species'>, 'id' | 'name'> | null
  breeds: Pick<Tables<'breeds'>, 'id' | 'name'> | null
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
  const { appliedPagination, paginationProps } = usePagination()

  const { data, isPending, error } = usePetList({
    filters: appliedFilters,
    search: appliedSearch,
    orders: orderByHook.appliedSorts,
    pagination: appliedPagination,
  })

  const pets: PetRow[] = (data?.data ?? []) as PetRow[]

  const columns: ColumnDef<PetRow>[] = [
    {
      accessorKey: 'name',
      header: ({ header }) => (
        <OrderByTableHeader field="name" orderByHook={orderByHook}>
          Nombre
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<PetRow> }) => (
        <div>{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'customers',
      header: ({ header }) => (
        <OrderByTableHeader field="client_id" orderByHook={orderByHook}>
          Cliente
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<PetRow> }) => {
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
      cell: ({ row }: { row: Row<PetRow> }) => {
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
      cell: ({ row }: { row: Row<PetRow> }) => {
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
      cell: ({ row }: { row: Row<PetRow> }) => {
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
      cell: ({ row }: { row: Row<PetRow> }) => (
        <PetActions pet={row.original} />
      ),
    },
  ]

  const table = useReactTable({
    data: pets,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  // Función para renderizar el encabezado de la tabla
  const renderTableHeader = useCallback(
    (headerGroup: HeaderGroup<PetRow>) => (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map((header: Header<PetRow, unknown>) => (
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
    (row: Row<PetRow>) => (
      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
        {row.getVisibleCells().map((cell: Cell<PetRow, unknown>) => (
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
          <CardContent className="p-6 space-y-3">
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
                  {format(new Date(pet.birth_date), 'dd/MM/yyyy', {
                    locale: es,
                  })}
                </div>
              )}
              {pet.weight && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Peso:</span>{' '}
                  {pet.weight} kg
                </div>
              )}
            </div>
          </CardContent>
        </Card>
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
              <PetCreateButton />
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
        </>
      )}

      {viewMode === 'cards' && renderCardsView()}
      {viewMode === 'list' && renderListView()}
      <Pagination {...paginationProps} totalItems={data.total} />
    </div>
  )
}
