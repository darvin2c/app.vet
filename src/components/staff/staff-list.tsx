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
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Database } from '@/types/supabase.types'
import { StaffActions } from './staff-actions'
import { StaffCreateButton } from './staff-create-button'
import { IsActiveDisplay } from '@/components/ui/is-active-field'
import { OrderByTableHeader } from '@/components/ui/order-by'
import { useOrderBy } from '@/components/ui/order-by'
import { OrderByConfig } from '@/components/ui/order-by'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from '@/components/ui/empty'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import {
  ArrowUpRightIcon,
  ChevronLeft,
  ChevronRight,
  Users,
} from 'lucide-react'
import useStaffList from '@/hooks/staff/use-staff-list'
import { useFilters, FilterConfig } from '@/components/ui/filters'
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

type Staff = Database['public']['Tables']['staff']['Row']

export function StaffList({
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
    data: staff = [],
    isPending,
    error,
  } = useStaffList({
    search: appliedSearch,
    filters: appliedFilters,
    orders: orderByHook.appliedSorts,
  })

  const columns: ColumnDef<Staff>[] = [
    {
      accessorKey: 'first_name',
      header: ({ header }) => (
        <OrderByTableHeader field="first_name" orderByHook={orderByHook}>
          Nombre
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Staff> }) => (
        <div className="font-medium">{row.getValue('first_name')}</div>
      ),
    },
    {
      accessorKey: 'last_name',
      header: ({ header }) => (
        <OrderByTableHeader field="last_name" orderByHook={orderByHook}>
          Apellido
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Staff> }) => (
        <div className="font-medium">{row.getValue('last_name')}</div>
      ),
    },
    {
      accessorKey: 'email',
      header: ({ header }) => (
        <OrderByTableHeader field="email" orderByHook={orderByHook}>
          Email
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Staff> }) => (
        <div className="text-sm text-muted-foreground">
          {row.getValue('email') || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'phone',
      header: ({ header }) => (
        <OrderByTableHeader field="phone" orderByHook={orderByHook}>
          Teléfono
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Staff> }) => (
        <div className="text-sm text-muted-foreground">
          {row.getValue('phone') || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'is_active',
      header: ({ header }) => (
        <OrderByTableHeader field="is_active" orderByHook={orderByHook}>
          Estado
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Staff> }) => (
        <IsActiveDisplay value={row.getValue('is_active')} />
      ),
    },
    {
      id: 'actions',
      cell: ({ row }: { row: Row<Staff> }) => (
        <StaffActions staff={row.original} />
      ),
    },
  ]

  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: staff,
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
    (headerGroup: HeaderGroup<Staff>) => (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map((header: Header<Staff, unknown>) => (
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
    (row: Row<Staff>) => (
      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
        {row.getVisibleCells().map((cell: Cell<Staff, unknown>) => (
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
      {staff.map((staffMember) => (
        <Card
          key={staffMember.id}
          className="hover:shadow-md transition-shadow"
        >
          <CardContent className="p-6 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">
                  {staffMember.first_name} {staffMember.last_name}
                </h3>
                {staffMember.email && (
                  <p className="text-sm text-muted-foreground">
                    {staffMember.email}
                  </p>
                )}
                {staffMember.phone && (
                  <p className="text-sm text-muted-foreground">
                    {staffMember.phone}
                  </p>
                )}
              </div>
              <StaffActions staff={staffMember} />
            </div>

            <div className="flex justify-between items-center">
              <IsActiveDisplay value={staffMember.is_active} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  // Función para renderizar vista de lista
  const renderListView = () => (
    <ItemGroup className="space-y-2">
      {staff.map((staffMember) => (
        <Item key={staffMember.id} variant="outline">
          <ItemContent>
            <ItemTitle>
              {staffMember.first_name} {staffMember.last_name}
            </ItemTitle>
            <ItemDescription>
              {staffMember.email && <span>{staffMember.email}</span>}
              {staffMember.phone && <span> • {staffMember.phone}</span>}
            </ItemDescription>
            <div className="flex gap-4 text-sm text-muted-foreground mt-2">
              <IsActiveDisplay value={staffMember.is_active} />
            </div>
          </ItemContent>
          <ItemActions>
            <StaffActions staff={staffMember} />
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  )

  // Estados de carga y error
  if (isPending) {
    // Durante la carga inicial, usar 'table' para evitar hydration mismatch
    // Después de la hidratación, usar el viewMode del usuario
    return <TableSkeleton variant={viewMode} />
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">
          Error al cargar personal: {error.message}
        </p>
      </div>
    )
  }

  if (staff.length === 0) {
    return (
      <div className="flex items-center justify-center text-muted-foreground h-[calc(100vh-100px)]">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Users className="h-16 w-16" />
            </EmptyMedia>
            <EmptyTitle>No hay personal</EmptyTitle>
            <EmptyDescription>
              No se encontró personal que coincida con los filtros aplicados.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <StaffCreateButton />
              <Button variant="outline">Importar Personal</Button>
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
        <ViewModeToggle onValueChange={setViewMode} resource="staff" />
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
                staff.length
              )}{' '}
              de {staff.length} miembros del personal
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
