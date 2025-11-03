'use client'

import { useState, useCallback } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  Row,
  Header,
  HeaderGroup,
  Cell,
} from '@tanstack/react-table'
import { Tables } from '@/types/supabase.types'
import { useSpecialtyList } from '@/hooks/specialties/use-specialty-list'
import { IsActiveDisplay } from '@/components/ui/is-active-field'
import { OrderByTableHeader } from '@/components/ui/order-by'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from '@/components/ui/empty'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
} from '@/components/ui/item'
import { SpecialtyActions } from './specialty-actions'
import { SpecialtyCreateButton } from './specialty-create-button'
import { useOrderBy } from '@/components/ui/order-by/use-order-by'
import { FilterConfig } from '@/components/ui/filters'
import { OrderByConfig } from '@/components/ui/order-by'

type Specialty = Tables<'specialties'>

interface SpecialtyListProps {
  filterConfig: FilterConfig[]
  orderByConfig: OrderByConfig
}

export function SpecialtyList({
  filterConfig,
  orderByConfig,
}: SpecialtyListProps) {
  const { data: specialties = [], isPending, error } = useSpecialtyList()

  const orderByHook = useOrderBy(orderByConfig)

  const columns: ColumnDef<Specialty>[] = [
    {
      accessorKey: 'name',
      header: ({ header }) => (
        <OrderByTableHeader field="name" orderByHook={orderByHook}>
          Nombre
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Specialty> }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Descripción',
      cell: ({ row }: { row: Row<Specialty> }) => (
        <div className="text-muted-foreground">{row.getValue('description') || '-'}</div>
      ),
    },
    {
      accessorKey: 'is_active',
      header: ({ header }) => (
        <OrderByTableHeader field="is_active" orderByHook={orderByHook}>
          Estado
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Specialty> }) => (
        <IsActiveDisplay value={row.getValue('is_active')} />
      ),
    },
    {
      id: 'actions',
      cell: ({ row }: { row: Row<Specialty> }) => (
        <SpecialtyActions specialty={row.original} />
      ),
    },
  ]

  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: specialties,
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

  const renderTableHeader = useCallback(
    (headerGroup: HeaderGroup<Specialty>) => (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map((header: Header<Specialty, unknown>) => (
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

  const renderTableRow = useCallback(
    (row: Row<Specialty>) => (
      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
        {row.getVisibleCells().map((cell: Cell<Specialty, unknown>) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ),
    []
  )

  const renderCardsView = useCallback(
    () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {specialties.map((specialty) => (
          <div
            key={specialty.id}
            className="border rounded-lg p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{specialty.name}</h3>
                {specialty.description && (
                  <p className="text-sm text-muted-foreground">
                    {specialty.description}
                  </p>
                )}
              </div>
              <SpecialtyActions specialty={specialty} />
            </div>

            <div className="flex justify-between items-center">
              <IsActiveDisplay value={specialty.is_active} />
            </div>
          </div>
        ))}
      </div>
    ),
    [specialties]
  )

  const renderListView = useCallback(
    () => (
      <ItemGroup>
        {specialties.map((specialty) => (
          <Item key={specialty.id}>
            <ItemContent>
              <ItemTitle>{specialty.name}</ItemTitle>
              <ItemDescription>
                {specialty.description || 'Sin descripción'}
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <IsActiveDisplay value={specialty.is_active} />
              <SpecialtyActions specialty={specialty} />
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
    ),
    [specialties]
  )

  if (isPending) {
    return <TableSkeleton />
  }

  if (error) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
              📋
            </div>
          </EmptyMedia>
          <EmptyTitle>Error al cargar especialidades</EmptyTitle>
          <EmptyDescription>
            Hubo un problema al cargar las especialidades. Por favor, intenta de nuevo.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <SpecialtyCreateButton />
        </EmptyContent>
      </Empty>
    )
  }

  if (specialties.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
              📋
            </div>
          </EmptyMedia>
          <EmptyTitle>No hay especialidades</EmptyTitle>
          <EmptyDescription>
            Comienza creando tu primera especialidad.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <SpecialtyCreateButton />
        </EmptyContent>
      </Empty>
    )
  }

  return (
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
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}