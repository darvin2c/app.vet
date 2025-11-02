'use client'

import { useState, useCallback } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
  SortingState,
  HeaderGroup,
  Header,
  Row,
  Cell,
} from '@tanstack/react-table'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { CustomerActions } from './customer-actions'
import { CustomerCreateButton } from './customer-create-button'
import { Tables } from '@/types/supabase.types'
import {
  Phone,
  Mail,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Users,
} from 'lucide-react'
import { IsActiveDisplay } from '@/components/ui/is-active-field'
import { OrderByTableHeader } from '@/components/ui/order-by/order-by'
import { useOrderBy } from '@/components/ui/order-by/use-order-by'
import { OrderByConfig } from '@/components/ui/order-by/order-by.types'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import useCustomerList from '@/hooks/customers/use-customer-list'
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

type Customer = Tables<'customers'>

export function CustomerList({
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

  // Convertir filtros aplicados al formato esperado por useCustomerLis
  const {
    data: customers = [],
    isPending,
    error,
  } = useCustomerList({
    filters: appliedFilters,
    orders: orderByHook.appliedSorts,
    search: appliedSearch,
  })
  // Callback para manejar la selección de clientes
  const handleCustomerSelect = useCallback((customer: Customer) => {
    // Aquí se puede implementar la lógica de selección si es necesaria
    console.log('Customer selected:', customer)
  }, [])

  // Configuración de columnas para la tabla
  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: 'first_name',
      header: () => (
        <OrderByTableHeader field="first_name" orderByHook={orderByHook}>
          Cliente
        </OrderByTableHeader>
      ),
      cell: ({ row }) => {
        const customer = row.original
        const fullName = `${customer.first_name} ${customer.last_name}`
        const initials = fullName
          .split(' ')
          .map((name) => name[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)

        return (
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{fullName}</div>
              {customer.email && (
                <div className="text-sm text-muted-foreground">
                  {customer.email}
                </div>
              )}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'phone',
      header: 'Teléfono',
      cell: ({ row }) => {
        const phone = row.getValue('phone') as string
        return phone ? (
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{phone}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      },
    },
    {
      accessorKey: 'address',
      header: 'Dirección',
      cell: ({ row }) => {
        const address = row.getValue('address') as string
        return address ? (
          <div className="flex items-center space-x-2 max-w-xs">
            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="truncate">{address}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      },
    },
    {
      accessorKey: 'is_active',
      header: 'Estado',
      cell: ({ row }) => {
        const isActive = row.getValue('is_active') as boolean
        return <IsActiveDisplay value={true} />
      },
    },
    {
      accessorKey: 'created_at',
      header: () => (
        <OrderByTableHeader field="created_at" orderByHook={orderByHook}>
          Fecha de Registro
        </OrderByTableHeader>
      ),
      cell: ({ row }) => {
        const date = row.getValue('created_at') as string
        return format(new Date(date), 'dd/MM/yyyy', { locale: es })
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <CustomerActions
          customer={row.original}
          onView={handleCustomerSelect}
        />
      ),
    },
  ]

  // Configuración de la tabla con React Table
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: customers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
    (headerGroup: HeaderGroup<Customer>) => (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map((header: Header<Customer, unknown>) => (
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
    (row: Row<Customer>) => (
      <TableRow
        key={row.id}
        data-state={row.getIsSelected() && 'selected'}
        className="cursor-pointer hover:bg-muted/50"
        onClick={() => handleCustomerSelect(row.original)}
      >
        {row.getVisibleCells().map((cell: Cell<Customer, unknown>) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ),
    [handleCustomerSelect]
  )

  // Función para renderizar vista de tabla
  const renderTableView = () => (
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
            customers.length
          )}{' '}
          de {customers.length} clientes
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
  )

  // Función para renderizar vista de tarjetas
  const renderCardsView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {customers.map((customer) => {
        const fullName = `${customer.first_name} ${customer.last_name}`
        const initials = fullName
          .split(' ')
          .map((name) => name[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)

        return (
          <Card
            key={customer.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleCustomerSelect(customer)}
          >
            <CardContent className="p-6 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{fullName}</h3>
                  </div>
                </div>
                <CustomerActions
                  customer={customer}
                  onView={handleCustomerSelect}
                />
              </div>

              <div className="space-y-2">
                {customer.email && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{customer.email}</span>
                  </div>
                )}
                {customer.phone && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{customer.phone}</span>
                  </div>
                )}
                {customer.address && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{customer.address}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <IsActiveDisplay value={true} />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )

  // Función para renderizar vista de lista
  const renderListView = () => (
    <ItemGroup className="space-y-2">
      {customers.map((customer) => {
        const fullName = `${customer.first_name} ${customer.last_name}`
        const initials = fullName
          .split(' ')
          .map((name) => name[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)

        return (
          <Item
            key={customer.id}
            variant="outline"
            className="cursor-pointer"
            onClick={() => handleCustomerSelect(customer)}
          >
            <ItemContent>
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <ItemTitle>{fullName}</ItemTitle>
                  <ItemDescription>
                    {customer.email && (
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span>{customer.email}</span>
                      </div>
                    )}
                    {customer.phone && (
                      <div className="flex items-center space-x-1 mt-1">
                        <Phone className="h-3 w-3" />
                        <span>{customer.phone}</span>
                      </div>
                    )}
                  </ItemDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <IsActiveDisplay value={true} />
                </div>
              </div>
            </ItemContent>
            <ItemActions>
              <CustomerActions
                customer={customer}
                onView={handleCustomerSelect}
              />
            </ItemActions>
          </Item>
        )
      })}
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
          Error al cargar clientes: {error.message}
        </p>
      </div>
    )
  }

  if (customers.length === 0) {
    return (
      <div className="flex items-center justify-center text-muted-foreground h-[calc(100vh-100px)]">
        <Empty>
          <EmptyHeader>
            <EmptyMedia>
              <Users className="h-16 w-16" />
            </EmptyMedia>
            <EmptyTitle>No hay clientes</EmptyTitle>
            <EmptyDescription>
              No se encontraron clientes que coincidan con los filtros
              aplicados.
            </EmptyDescription>
            <div className="mt-4">
              <CustomerCreateButton />
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
        <ViewModeToggle onValueChange={setViewMode} resource="customers" />
      </div>

      {/* Contenido según la vista seleccionada */}
      {viewMode === 'table' && renderTableView()}
      {viewMode === 'cards' && renderCardsView()}
      {viewMode === 'list' && renderListView()}
    </div>
  )
}
