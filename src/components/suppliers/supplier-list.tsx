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
import { Card, CardContent } from '@/components/ui/card'
import { Database } from '@/types/supabase.types'
import { SupplierActions } from './supplier-actions'
import { SupplierCreateButton } from './supplier-create-button'
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
import { ChevronLeft, ChevronRight, Building } from 'lucide-react'
import useSupplierList from '@/hooks/suppliers/use-supplier-list'
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

type Supplier = Database['public']['Tables']['suppliers']['Row']

export function SupplierList({
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
    data: suppliers = [],
    isPending,
    error,
  } = useSupplierList({
    filters: appliedFilters,
    search: appliedSearch,
    orders: orderByHook.appliedSorts,
  })

  const handleEdit = useCallback((supplier: Supplier) => {
    // Handle edit logic
    console.log('Edit supplier:', supplier)
  }, [])

  const handleDelete = useCallback((supplier: Supplier) => {
    // Handle delete logic
    console.log('Delete supplier:', supplier)
  }, [])

  const columns: ColumnDef<Supplier>[] = [
    {
      accessorKey: 'name',
      header: ({ header }) => (
        <OrderByTableHeader field="name" orderByHook={orderByHook}>
          Nombre
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Supplier> }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'contact_person',
      header: ({ header }) => (
        <OrderByTableHeader field="contact_person" orderByHook={orderByHook}>
          Contacto
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Supplier> }) => {
        const contact = row.getValue('contact_person') as string
        return (
          <div className="text-sm text-muted-foreground">{contact || '-'}</div>
        )
      },
    },
    {
      accessorKey: 'email',
      header: ({ header }) => (
        <OrderByTableHeader field="email" orderByHook={orderByHook}>
          Email
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Supplier> }) => {
        const email = row.getValue('email') as string
        return email ? (
          <a
            href={`mailto:${email}`}
            className="text-blue-600 hover:underline text-sm"
          >
            {email}
          </a>
        ) : (
          <div className="text-sm text-muted-foreground">-</div>
        )
      },
    },
    {
      accessorKey: 'phone',
      header: ({ header }) => (
        <OrderByTableHeader field="phone" orderByHook={orderByHook}>
          Teléfono
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Supplier> }) => {
        const phone = row.getValue('phone') as string
        return phone ? (
          <a
            href={`tel:${phone}`}
            className="text-blue-600 hover:underline text-sm"
          >
            {phone}
          </a>
        ) : (
          <div className="text-sm text-muted-foreground">-</div>
        )
      },
    },
    {
      accessorKey: 'is_active',
      header: ({ header }) => (
        <OrderByTableHeader field="is_active" orderByHook={orderByHook}>
          Estado
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Supplier> }) => (
        <IsActiveDisplay value={row.getValue('is_active')} />
      ),
    },
    {
      id: 'actions',
      cell: ({ row }: { row: Row<Supplier> }) => (
        <SupplierActions supplier={row.original} />
      ),
    },
  ]

  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: suppliers,
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
    (headerGroup: HeaderGroup<Supplier>) => (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map((header: Header<Supplier, unknown>) => (
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
    (row: Row<Supplier>) => (
      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
        {row.getVisibleCells().map((cell: Cell<Supplier, unknown>) => (
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
      {suppliers.map((supplier) => (
        <Card key={supplier.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="font-semibold">{supplier.name}</h3>
                  {supplier.contact_person && (
                    <p className="text-sm text-muted-foreground">
                      {supplier.contact_person}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <IsActiveDisplay value={supplier.is_active} />
                <SupplierActions supplier={supplier} />
              </div>
            </div>
            <div className="space-y-2 text-sm">
              {supplier.email && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>Email:</span>
                  <a
                    href={`mailto:${supplier.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {supplier.email}
                  </a>
                </div>
              )}
              {supplier.phone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>Teléfono:</span>
                  <a
                    href={`tel:${supplier.phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {supplier.phone}
                  </a>
                </div>
              )}
              {supplier.address && (
                <div className="flex items-start gap-2 text-muted-foreground">
                  <span>Dirección:</span>
                  <span>{supplier.address}</span>
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
      {suppliers.map((supplier) => (
        <Item key={supplier.id} variant="outline">
          <ItemContent>
            <ItemTitle className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              {supplier.name}
              <IsActiveDisplay value={supplier.is_active} />
            </ItemTitle>
            <ItemDescription>
              {supplier.contact_person &&
                `Contacto: ${supplier.contact_person}`}
              {supplier.email && ` • Email: ${supplier.email}`}
              {supplier.phone && ` • Tel: ${supplier.phone}`}
            </ItemDescription>
            <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
              {supplier.address && (
                <span className="flex items-center gap-1">
                  <span>Dirección: {supplier.address}</span>
                </span>
              )}
            </div>
          </ItemContent>
          <ItemActions>
            <SupplierActions supplier={supplier} />
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  )

  if (isPending) {
    return <TableSkeleton variant={viewMode} />
  }

  if (!suppliers || suppliers.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <Building className="h-10 w-10" />
          </EmptyMedia>
          <EmptyTitle>No hay proveedores</EmptyTitle>
          <EmptyDescription>
            No se encontraron proveedores con los filtros aplicados.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controles de vista */}
      <div className="flex justify-end">
        <ViewModeToggle onValueChange={setViewMode} resource="suppliers" />
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
                suppliers.length
              )}{' '}
              de {suppliers.length} proveedores
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
