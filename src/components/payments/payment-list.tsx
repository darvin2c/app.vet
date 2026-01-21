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
import { CreditCard } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { Badge } from '@/components/ui/badge'
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
import { type ViewMode } from '@/components/ui/view-mode-toggle'
import { OrderByTableHeader } from '@/components/ui/order-by'

import usePaymentList, {
  PaymentWithRelations,
} from '@/hooks/payments/use-payment-list'
import { PaymentActions } from './payment-actions'
import { PaymentCreateButton } from './payment-create-button'
import { useFilters } from '@/components/ui/filters'
import { useSearch } from '@/components/ui/search-input/use-search'
import { useOrderBy } from '@/components/ui/order-by/use-order-by'
import type { FilterConfig } from '@/components/ui/filters'
import type { OrderByConfig } from '@/components/ui/order-by'
import { usePaymentType } from '@/hooks/payment-methods/use-payment-type'

interface PaymentListProps {
  filterConfig: FilterConfig[]
  orderByConfig: OrderByConfig
}

export function PaymentList({ filterConfig, orderByConfig }: PaymentListProps) {
  // Estado para el modo de vista - inicializado con valor por defecto para evitar hydration mismatch
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const { getPaymentType } = usePaymentType()

  const { appliedFilters } = useFilters(filterConfig)
  const { appliedSearch } = useSearch()
  const orderByHook = useOrderBy(orderByConfig)

  const {
    data: payments = [],
    isPending,
    error,
  } = usePaymentList({
    filters: appliedFilters,
    search: appliedSearch,
    orders: [
      {
        field: 'payment_date',
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
        cell: ({ row }) => {
          const date = (row.original.payment_date as string) ?? ''
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
        cell: ({ row }) => {
          const amount = (row.original.amount as number) ?? 0
          return `$${amount.toFixed(2)}`
        },
      },
      {
        id: 'payment_method_name',
        header: 'Método de Pago',
        cell: ({ row }) => {
          const paymentMethod = row.original.payment_methods
          const paymentType = getPaymentType(paymentMethod?.payment_type)

          return paymentMethod ? (
            <div className="flex items-center gap-2">
              {paymentType?.icon && <paymentType.icon />}
              <span>{paymentMethod.name}</span>
            </div>
          ) : (
            '-'
          )
        },
      },
      {
        id: 'customer_name',
        header: 'Cliente',
        cell: ({ row }) => {
          const customer = row.original.customers
          return customer ? `${customer.first_name} ${customer.last_name}` : '-'
        },
      },
      {
        id: 'order_info',
        header: 'Orden',
        cell: ({ row }) => {
          const order = row.original.orders
          return order ? (
            <div className="flex items-center gap-2">
              <span>#{order.order_number}</span>
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

  const table = useReactTable<PaymentWithRelations>({
    data: payments as PaymentWithRelations[],
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
              {header.isPlaceholder ? null : (
                <div className="flex items-center gap-2">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </div>
              )}
            </TableHead>
          )
        )}
      </TableRow>
    ),
    []
  )

  // Renderizado de tabla, cards y lista
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {(error as Error)?.message || 'Error al cargar pagos'}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {isPending ? (
        viewMode === 'table' ? (
          <TableSkeleton />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Cargando pagos...
          </div>
        )
      ) : payments.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia>
              <CreditCard className="h-10 w-10" />
            </EmptyMedia>
            <EmptyTitle>No hay pagos</EmptyTitle>
            <EmptyDescription>
              Crea tu primer pago o importa desde tu sistema.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <PaymentCreateButton />
          </EmptyContent>
        </Empty>
      ) : viewMode === 'table' ? (
        <Table>
          <TableHeader>
            {table
              .getHeaderGroups()
              .map((headerGroup) => renderTableHeader(headerGroup))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row
                  .getVisibleCells()
                  .map((cell: Cell<PaymentWithRelations, unknown>) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {payments.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <div className="font-medium">
                    {format(new Date(p.payment_date as string), 'dd/MM/yyyy', {
                      locale: es,
                    })}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {p.customers
                      ? `${p.customers.first_name} ${p.customers.last_name}`
                      : '-'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    ${(p.amount as number).toFixed(2)}
                  </div>
                  <Badge variant="outline" className="text-xs mt-1">
                    {p.payment_methods?.payment_type || 'N/A'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <ItemGroup>
          {payments.map((p) => (
            <Item key={p.id}>
              <ItemContent>
                <ItemTitle>
                  {format(new Date(p.payment_date as string), 'dd/MM/yyyy', {
                    locale: es,
                  })}
                </ItemTitle>
                <ItemDescription>
                  {p.customers
                    ? `${p.customers.first_name} ${p.customers.last_name}`
                    : '-'}{' '}
                  — ${(p.amount as number).toFixed(2)}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <PaymentActions payment={p as PaymentWithRelations} />
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      )}
    </div>
  )
}
