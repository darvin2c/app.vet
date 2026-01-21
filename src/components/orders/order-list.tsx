'use client'

import { useState, useCallback } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
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
import { Clock, Package, DollarSign } from 'lucide-react'
import useOrderList from '@/hooks/orders/use-order-list'
import { useFilters, FilterConfig } from '@/components/ui/filters'
import { useSearch } from '@/components/ui/search-input/use-search'
import { ViewModeToggle, ViewMode } from '@/components/ui/view-mode-toggle'
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
} from '@/components/ui/item'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { DateDisplay } from '../ui/date-picker'
import { CurrencyDisplay } from '../ui/currency-input'
import { Pagination, usePagination } from '../ui/pagination'
import { Alert, AlertDescription } from '../ui/alert'
import { OrderIcon } from '../icons'

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
  const { appliedSearch } = useSearch()
  const { appliedPagination, paginationProps } = usePagination()
  const { data, isPending, error } = useOrderList({
    filters: appliedFilters,
    search: appliedSearch,
    orders: orderByHook.appliedSorts,
    pagination: appliedPagination,
  })
  const orders = data?.data || []
  console.log(orders)

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: 'order_number',
      header: ({ header }) => (
        <OrderByTableHeader field="order_number" orderByHook={orderByHook}>
          Número
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Order> }) => (
        <div>{row.getValue('order_number')}</div>
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
            {customer ? `${customer.first_name} ${customer.last_name}` : ''}
          </div>
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
      accessorKey: 'paid_amount',
      header: ({ header }) => (
        <OrderByTableHeader field="paid_amount" orderByHook={orderByHook}>
          Pagado
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Order> }) => {
        return <CurrencyDisplay value={row.getValue('paid_amount')} />
      },
    },
    {
      accessorKey: 'balance',
      header: () => <div>Balance</div>,
      cell: ({ row }: { row: Row<Order> }) => {
        return <CurrencyDisplay value={row.getValue('balance')} />
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
        const itemCount = 0 // TODO: Obtener el conteo de items desde la consulta
        const paid = order.paid_amount || 0
        const balance = (order.total || 0) - paid
        const balanceClass =
          balance < 0 ? 'text-destructive' : balance > 0 ? 'text-green-600' : ''

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

              <div className="text-xs">
                <span className="text-muted-foreground">Pagado: </span>
                <span className="font-medium">
                  {new Intl.NumberFormat('es-PE', {
                    style: 'currency',
                    currency: 'PEN',
                  }).format(paid)}
                </span>
                <span className="text-muted-foreground"> • Balance: </span>
                <span className={`font-medium ${balanceClass}`}>
                  {new Intl.NumberFormat('es-PE', {
                    style: 'currency',
                    currency: 'PEN',
                  }).format(balance)}
                </span>
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
        const itemCount = 0 // TODO: Obtener el conteo de items desde la consulta
        const paid = order.paid_amount || 0
        const balance = (order.total || 0) - paid
        const balanceClass =
          balance < 0 ? 'text-destructive' : balance > 0 ? 'text-green-600' : ''

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
                  <div className="text-right">
                    <div className="font-medium">
                      <CurrencyDisplay
                        className="text-lg font-bold"
                        value={order.total}
                      />
                    </div>
                    <div className="text-xs">
                      <span className="text-muted-foreground">Pagado: </span>
                      <span className="font-medium">
                        {new Intl.NumberFormat('es-PE', {
                          style: 'currency',
                          currency: 'PEN',
                        }).format(paid)}
                      </span>
                      <span className="text-muted-foreground">
                        {' '}
                        • Balance:{' '}
                      </span>
                      <span className={`font-medium ${balanceClass}`}>
                        {new Intl.NumberFormat('es-PE', {
                          style: 'currency',
                          currency: 'PEN',
                        }).format(balance)}
                      </span>
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
    <div>
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

  if (isPending) {
    return <TableSkeleton />
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Ocurrió un error al cargar las órdenes. Por favor, intenta nuevamente.
        </AlertDescription>
      </Alert>
    )
  }

  if (orders.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <OrderIcon className="h-9 w-9" />
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
      <div className="flex items-center justify-end">
        <ViewModeToggle onValueChange={setViewMode} resource="orders" />
      </div>

      {viewMode === 'table' && renderTableView()}
      {viewMode === 'cards' && renderCardView()}
      {viewMode === 'list' && renderListView()}
      <Pagination {...paginationProps} totalItems={data.total} />
    </div>
  )
}
