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
import { Badge } from '@/components/ui/badge'
import { Tables } from '@/types/supabase.types'
import { OrderActions } from './order-actions'
import { OrderCreateButton } from './order-create-button'
import { OrderByTableHeader } from '@/components/ui/order-by'
import { useOrderBy } from '@/components/ui/order-by/use-order-by'
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
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Clock,
  XCircle,
  Package,
  DollarSign,
} from 'lucide-react'
import useOrderList from '@/hooks/orders/use-order-list'
import { useFilters } from '@/hooks/use-filters'
import { FilterConfig } from '@/types/filters.types'
import { useSimpleSearch } from '@/hooks/use-search'
import { ViewModeToggle, ViewMode } from '@/components/ui/view-mode-toggle'
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
} from '@/components/ui/item'
import { orderStatusOptions } from '@/schemas/orders.schema'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { DateDisplay } from '../ui/date-picker'
import { CurrencyDisplay } from '../ui/current-input'
import useOrderStatus from '@/hooks/orders/use-order-status'

// Función para obtener la variante del badge según el estado
function getStatusBadgeVariant(
  status: string
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'pending':
      return 'outline'
    case 'processing':
      return 'secondary'
    case 'completed':
      return 'default'
    case 'cancelled':
      return 'destructive'
    default:
      return 'outline'
  }
}

type Order = Tables<'orders'> & {
  customer: Tables<'customers'> | null
  order_items?: Array<
    Tables<'order_items'> & {
      product: Tables<'products'> | null
    }
  >
}

export function OrderList({
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
  const search = useSimpleSearch()
  const {
    data: orders = [],
    isPending,
    error,
  } = useOrderList({
    filters: appliedFilters,
    search: search,
    orders: orderByHook.appliedSorts,
  })

  const { getOrderStatus } = useOrderStatus()

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: 'order_number',
      header: ({ header }) => (
        <OrderByTableHeader field="order_number" orderByHook={orderByHook}>
          Número
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Order> }) => (
        <div className="font-medium">{row.getValue('order_number')}</div>
      ),
    },
    {
      accessorKey: 'customer',
      header: ({ header }) => (
        <OrderByTableHeader field="customer_id" orderByHook={orderByHook}>
          Cliente
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Order> }) => {
        const customer = row.original.customer
        return (
          <div className="text-sm">
            {customer
              ? `${customer.first_name} ${customer.last_name}`
              : 'Sin cliente'}
          </div>
        )
      },
    },

    {
      accessorKey: 'status',
      header: ({ header }) => (
        <OrderByTableHeader field="status" orderByHook={orderByHook}>
          Estado
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Order> }) => {
        const status = getOrderStatus(row.getValue('status'))
        return (
          <Badge className={status.className}>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {status.label}
            </div>
          </Badge>
        )
      },
    },
    {
      accessorKey: 'total',
      header: ({ header }) => (
        <OrderByTableHeader field="total" orderByHook={orderByHook}>
          Total
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Order> }) => {
        const total = row.getValue('total') as number
        return (
          <div className="font-medium">
            {new Intl.NumberFormat('es-PE', {
              style: 'currency',
              currency: 'PEN',
            }).format(total)}
          </div>
        )
      },
    },
    {
      accessorKey: 'created_at',
      header: ({ header }) => (
        <OrderByTableHeader field="created_at" orderByHook={orderByHook}>
          Fecha
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Order> }) => {
        const date = new Date(row.getValue('created_at'))
        return (
          <div className="text-sm text-muted-foreground">
            {format(date, 'dd/MM/yyyy HH:mm', { locale: es })}
          </div>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }: { row: Row<Order> }) => (
        <OrderActions order={row.original} />
      ),
    },
  ]

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  // Función para renderizar el encabezado de la tabla
  const renderTableHeader = useCallback(
    (headerGroup: HeaderGroup<Order>) => (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map((header: Header<Order, unknown>) => (
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
    (row: Row<Order>) => (
      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
        {row.getVisibleCells().map((cell: Cell<Order, unknown>) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ),
    []
  )

  // Función para renderizar vista de tarjetas
  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {orders.map((order) => {
        const customer = order.customer
        const status = getOrderStatus(order.status)
        const itemCount = 0 // TODO: Obtener el conteo de items desde la consulta

        return (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold">{order.order_number}</h3>
                  <p className="text-sm text-muted-foreground">
                    {customer
                      ? `${customer.first_name} ${customer.last_name}`
                      : 'Sin cliente'}
                  </p>
                </div>
                <Badge variant={getStatusBadgeVariant(order.status)}>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {status.label}
                  </div>
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Package className="w-4 h-4" />
                  {itemCount} items
                </div>
                <div className="flex items-center gap-1 font-medium">
                  <DollarSign className="w-4 h-4" />
                  {new Intl.NumberFormat('es-PE', {
                    style: 'currency',
                    currency: 'PEN',
                  }).format(order.total)}
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                <DateDisplay value={order.created_at} />
              </div>

              <OrderActions order={order} />
            </CardContent>
          </Card>
        )
      })}
    </div>
  )

  // Función para renderizar vista de lista
  const renderListView = () => (
    <ItemGroup className="space-y-2">
      {orders.map((order) => {
        const customer = order.customer
        const status = getOrderStatus(order.status)
        const itemCount = 0 // TODO: Obtener el conteo de items desde la consulta

        return (
          <Item key={order.id}>
            <ItemContent>
              <div className="flex items-center justify-between w-full">
                <div className="flex-1">
                  <ItemTitle>{order.order_number}</ItemTitle>
                  <ItemDescription>
                    {customer
                      ? `${customer.first_name} ${customer.last_name}`
                      : 'Sin cliente'}
                    {` • ${itemCount} items`}
                  </ItemDescription>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={status.className}>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {status.label}
                    </div>
                  </Badge>
                  <div className="text-right">
                    <div className="font-medium">
                      <CurrencyDisplay
                        className="text-lg font-bold"
                        value={order.total}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <DateDisplay value={order.created_at} />
                    </div>
                  </div>
                </div>
              </div>
            </ItemContent>
            <ItemActions>
              <OrderActions order={order} />
            </ItemActions>
          </Item>
        )
      })}
    </ItemGroup>
  )

  // Función para renderizar vista de tabla
  const renderTableView = () => (
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
                No se encontraron resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )

  // Función para renderizar paginación
  const renderPagination = () => (
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
          orders.length
        )}{' '}
        de {orders.length} órdenes
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
  )

  if (isPending) {
    return <TableSkeleton />
  }

  if (error) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <XCircle className="h-8 w-8" />
          </EmptyMedia>
          <EmptyTitle>Error al cargar órdenes</EmptyTitle>
          <EmptyDescription>
            Ocurrió un error al cargar las órdenes. Por favor, intenta
            nuevamente.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (orders.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <ShoppingCart className="h-8 w-8" />
          </EmptyMedia>
          <EmptyTitle>No hay órdenes</EmptyTitle>
          <EmptyDescription>
            No se encontraron órdenes. Crea tu primera orden para comenzar.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <OrderCreateButton />
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {orders.length}{' '}
          {orders.length === 1 ? 'orden encontrada' : 'órdenes encontradas'}
        </div>
        <ViewModeToggle onValueChange={setViewMode} resource="orders" />
      </div>

      {viewMode === 'table' && renderTableView()}
      {viewMode === 'cards' && renderCardView()}
      {viewMode === 'list' && renderListView()}

      {orders.length > 0 && renderPagination()}
    </div>
  )
}
