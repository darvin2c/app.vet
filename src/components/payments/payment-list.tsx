'use client'

import { useCallback, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
  type HeaderGroup,
  type Header,
  type Cell,
} from '@tanstack/react-table'
import {
  ArrowUpRightIcon,
  CheckCircle2Icon,
  ChevronLeft,
  ChevronRight,
  CreditCard,
} from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  ItemGroup,
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from '@/components/ui/item'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import { ViewModeToggle, type ViewMode } from '@/components/ui/view-mode-toggle'
import { OrderByTableHeader } from '@/components/ui/order-by'

import usePaymentList, {
  PaymentWithRelations,
} from '@/hooks/payments/use-payment-list'
import { PaymentActions } from './payment-actions'
import { PaymentCreateButton } from './payment-create-button'
import { useFilters } from '@/components/ui/filters'
import { useSearch } from '@/hooks/use-search'
import { useOrderBy } from '@/components/ui/order-by/use-order-by'
import type { FilterConfig } from '@/components/ui/filters'
import type { OrderByConfig } from '@/components/ui/order-by'

import type { Tables } from '@/types/supabase.types'

interface PaymentListProps {
  filterConfig: FilterConfig[]
  orderByConfig: OrderByConfig
}

export function PaymentList({ filterConfig, orderByConfig }: PaymentListProps) {
  // Estado para el modo de vista - inicializado con valor por defecto para evitar hydration mismatch
  const [viewMode, setViewMode] = useState<ViewMode>('table')

  const { appliedFilters } = useFilters(filterConfig)
  const { appliedSearch } = useSearch()
  const orderByHook = useOrderBy(orderByConfig)

  const {
    data: payments = [],
    isPending,
    error,
  } = usePaymentList({
    filters: [],
    search: '',
    orders: [
      {
        field: 'payment_date',
        ascending: false,
        direction: 'desc',
      },
    ],
  })

  // Definición de columnas para la tabla
  const columns: ColumnDef<PaymentWithRelations>[] = useMemo(
    () => [
      {
        accessorKey: 'payment_date',
        header: ({ header }) => (
          <OrderByTableHeader field="payment_date" orderByHook={orderByHook}>
            Fecha de Pago
          </OrderByTableHeader>
        ),
        cell: ({ row }: { row: Row<PaymentWithRelations> }) => {
          const date = row.getValue('payment_date') as string
          return format(new Date(date), 'dd/MM/yyyy', { locale: es })
        },
      },
      {
        accessorKey: 'amount',
        header: ({ header }) => (
          <OrderByTableHeader field="amount" orderByHook={orderByHook}>
            Monto
          </OrderByTableHeader>
        ),
        cell: ({ row }: { row: Row<PaymentWithRelations> }) => {
          const amount = row.getValue('amount') as number
          return `$${amount.toFixed(2)}`
        },
      },
      {
        accessorKey: 'payment_methods.name',
        header: 'Método de Pago',
        cell: ({ row }: { row: Row<PaymentWithRelations> }) => {
          const paymentMethod = row.original.payment_methods
          return paymentMethod ? (
            <div className="flex items-center gap-2">
              <span>{paymentMethod.name}</span>
              <Badge variant="outline" className="text-xs">
                {paymentMethod.payment_type}
              </Badge>
            </div>
          ) : (
            '-'
          )
        },
      },
      {
        accessorKey: 'customers.name',
        header: 'Cliente',
        cell: ({ row }: { row: Row<PaymentWithRelations> }) => {
          const customer = row.original.customers
          return customer ? `${customer.first_name} ${customer.last_name}` : '-'
        },
      },
      {
        accessorKey: 'orders.order_number',
        header: 'Orden',
        cell: ({ row }: { row: Row<PaymentWithRelations> }) => {
          const order = row.original.orders
          return order ? (
            <div className="flex items-center gap-2">
              <span>#{order.order_number}</span>
              <Badge variant="outline" className="text-xs">
                ${order.total?.toFixed(2) || '0.00'}
              </Badge>
            </div>
          ) : (
            '-'
          )
        },
      },
      {
        accessorKey: 'reference',
        header: ({ header }) => (
          <OrderByTableHeader field="reference" orderByHook={orderByHook}>
            Referencia
          </OrderByTableHeader>
        ),
        cell: ({ row }: { row: Row<PaymentWithRelations> }) => {
          const ref = row.getValue('reference') as string | null
          return ref || '-'
        },
      },
      {
        id: 'actions',
        cell: ({ row }: { row: Row<PaymentWithRelations> }) => (
          <PaymentActions payment={row.original} />
        ),
      },
    ],
    [orderByHook]
  )

  const table = useReactTable({
    data: payments,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  // Función para renderizar el encabezado de la tabla
  const renderTableHeader = useCallback(
    (headerGroup: HeaderGroup<PaymentWithRelations>) => (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map(
          (header: Header<PaymentWithRelations, unknown>) => (
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
    ),
    []
  )

  // Función para renderizar las filas de la tabla
  const renderTableRow = useCallback(
    (row: Row<PaymentWithRelations>) => (
      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
        {row
          .getVisibleCells()
          .map((cell: Cell<PaymentWithRelations, unknown>) => (
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
      {payments.map((payment: PaymentWithRelations) => (
        <Card key={payment.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">
                  ${payment.amount.toFixed(2)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(payment.payment_date), 'dd/MM/yyyy', {
                    locale: es,
                  })}
                </p>
              </div>
              <PaymentActions payment={payment} />
            </div>

            <div className="space-y-2">
              {payment.payment_methods && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Método:</span>{' '}
                  <div className="flex items-center gap-2 mt-1">
                    <span>{payment.payment_methods.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {payment.payment_methods.payment_type}
                    </Badge>
                  </div>
                </div>
              )}

              {payment.customers && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Cliente:</span>{' '}
                  {`${payment.customers.first_name} ${payment.customers.last_name}`}
                </div>
              )}

              {payment.orders && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Orden:</span>{' '}
                  <div className="flex items-center gap-2 mt-1">
                    <span>#{payment.orders.order_number}</span>
                    <Badge variant="outline" className="text-xs">
                      ${payment.orders.total?.toFixed(2) || '0.00'}
                    </Badge>
                  </div>
                </div>
              )}

              {payment.reference && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Referencia:</span>{' '}
                  {payment.reference}
                </div>
              )}
            </div>

            {payment.notes && (
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">{payment.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )

  // Función para renderizar vista de lista
  const renderListView = () => (
    <ItemGroup className="space-y-2">
      {payments.map((payment: PaymentWithRelations) => (
        <Item key={payment.id} variant="outline">
          <ItemContent>
            <ItemTitle>${payment.amount.toFixed(2)}</ItemTitle>
            <ItemDescription>
              {payment.customers
                ? `${payment.customers.first_name} ${payment.customers.last_name}`
                : 'Sin cliente'}{' '}
              - {payment.payment_methods?.name || 'Sin método'}
            </ItemDescription>
            <div className="flex gap-4 text-sm text-muted-foreground mt-2">
              <span>
                Fecha:{' '}
                {format(new Date(payment.payment_date), 'dd/MM/yyyy', {
                  locale: es,
                })}
              </span>
              {payment.orders && (
                <span>Orden: #{payment.orders.order_number}</span>
              )}
              {payment.reference && (
                <span>Referencia: {payment.reference}</span>
              )}
            </div>
          </ItemContent>
          <ItemActions>
            <PaymentActions payment={payment} />
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
      <Alert variant={'destructive'}>
        <CheckCircle2Icon />
        <AlertTitle>Error al cargar pagos</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )
  }

  if (payments.length === 0) {
    return (
      <div className="flex items-center justify-center text-muted-foreground h-[calc(100vh-200px)]">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CreditCard className="h-16 w-16" />
            </EmptyMedia>
            <EmptyTitle>No hay pagos</EmptyTitle>
            <EmptyDescription>
              No se encontraron pagos que coincidan con los filtros aplicados.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <PaymentCreateButton isResponsive={false}>
                Crear Pago
              </PaymentCreateButton>
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
        <ViewModeToggle onValueChange={setViewMode} resource="payments" />
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
                payments.length
              )}{' '}
              de {payments.length} pagos
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
