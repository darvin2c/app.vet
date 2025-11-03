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
import { usePaymentMethodList } from '@/hooks/payment-methods/use-payment-method-list'
import { Badge } from '@/components/ui/badge'
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
import { PaymentMethodActions } from './payment-method-actions'
import { PaymentMethodCreateButton } from './payment-method-create-button'
import { useOrderBy } from '@/components/ui/order-by/use-order-by'
import { FilterConfig } from '@/components/ui/filters'
import { OrderByConfig } from '@/components/ui/order-by'

type PaymentMethod = Tables<'payment_methods'>

const paymentTypeLabels = {
  cash: 'Efectivo',
  card: 'Tarjeta',
  transfer: 'Transferencia',
  check: 'Cheque',
  other: 'Otro',
} as const

const paymentTypeColors = {
  cash: 'bg-green-100 text-green-800',
  card: 'bg-blue-100 text-blue-800',
  transfer: 'bg-purple-100 text-purple-800',
  check: 'bg-orange-100 text-orange-800',
  other: 'bg-gray-100 text-gray-800',
} as const

interface PaymentMethodListProps {
  filterConfig: FilterConfig[]
  orderByConfig: OrderByConfig
}

export function PaymentMethodList({
  filterConfig,
  orderByConfig,
}: PaymentMethodListProps) {
  const { data: paymentMethods = [], isPending, error } = usePaymentMethodList()

  const orderByHook = useOrderBy(orderByConfig)

  const columns: ColumnDef<PaymentMethod>[] = [
    {
      accessorKey: 'code',
      header: ({ header }) => (
        <OrderByTableHeader field="code" orderByHook={orderByHook}>
          Código
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<PaymentMethod> }) => (
        <div className="font-mono text-sm">{row.getValue('code')}</div>
      ),
    },
    {
      accessorKey: 'name',
      header: ({ header }) => (
        <OrderByTableHeader field="name" orderByHook={orderByHook}>
          Nombre
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<PaymentMethod> }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'payment_type',
      header: ({ header }) => (
        <OrderByTableHeader field="payment_type" orderByHook={orderByHook}>
          Tipo
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<PaymentMethod> }) => {
        const paymentType = row.getValue(
          'payment_type'
        ) as keyof typeof paymentTypeLabels
        return (
          <Badge className={paymentTypeColors[paymentType]}>
            {paymentTypeLabels[paymentType]}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'sort_order',
      header: ({ header }) => (
        <OrderByTableHeader field="sort_order" orderByHook={orderByHook}>
          Orden
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<PaymentMethod> }) => (
        <div className="text-center">{row.getValue('sort_order') || '-'}</div>
      ),
    },
    {
      accessorKey: 'is_active',
      header: ({ header }) => (
        <OrderByTableHeader field="is_active" orderByHook={orderByHook}>
          Estado
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<PaymentMethod> }) => (
        <IsActiveDisplay value={row.getValue('is_active')} />
      ),
    },
    {
      id: 'actions',
      cell: ({ row }: { row: Row<PaymentMethod> }) => (
        <PaymentMethodActions paymentMethod={row.original} />
      ),
    },
  ]

  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: paymentMethods,
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
    (headerGroup: HeaderGroup<PaymentMethod>) => (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map((header: Header<PaymentMethod, unknown>) => (
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
    (row: Row<PaymentMethod>) => (
      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
        {row.getVisibleCells().map((cell: Cell<PaymentMethod, unknown>) => (
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
        {paymentMethods.map((paymentMethod) => {
          const paymentType =
            paymentMethod.payment_type as keyof typeof paymentTypeLabels
          return (
            <div
              key={paymentMethod.id}
              className="border rounded-lg p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{paymentMethod.name}</h3>
                  <p className="text-sm text-muted-foreground font-mono">
                    {paymentMethod.code}
                  </p>
                </div>
                <PaymentMethodActions paymentMethod={paymentMethod} />
              </div>

              <div className="flex justify-between items-center">
                <Badge className={paymentTypeColors[paymentType]}>
                  {paymentTypeLabels[paymentType]}
                </Badge>
                <IsActiveDisplay value={paymentMethod.is_active} />
              </div>

              {paymentMethod.sort_order && (
                <div className="text-sm text-muted-foreground">
                  Orden: {paymentMethod.sort_order}
                </div>
              )}
            </div>
          )
        })}
      </div>
    ),
    [paymentMethods]
  )

  const renderListView = useCallback(
    () => (
      <ItemGroup>
        {paymentMethods.map((paymentMethod) => {
          const paymentType =
            paymentMethod.payment_type as keyof typeof paymentTypeLabels
          return (
            <Item key={paymentMethod.id}>
              <ItemContent>
                <ItemTitle>{paymentMethod.name}</ItemTitle>
                <ItemDescription>
                  <span className="font-mono">{paymentMethod.code}</span>
                  {' • '}
                  <Badge className={paymentTypeColors[paymentType]}>
                    {paymentTypeLabels[paymentType]}
                  </Badge>
                  {paymentMethod.sort_order && (
                    <>
                      {' • '}
                      <span>Orden: {paymentMethod.sort_order}</span>
                    </>
                  )}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <IsActiveDisplay value={paymentMethod.is_active} />
                <PaymentMethodActions paymentMethod={paymentMethod} />
              </ItemActions>
            </Item>
          )
        })}
      </ItemGroup>
    ),
    [paymentMethods]
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
              <span className="text-2xl">💳</span>
            </div>
          </EmptyMedia>
          <EmptyTitle>Error al cargar métodos de pago</EmptyTitle>
          <EmptyDescription>
            Ocurrió un error al cargar los métodos de pago. Por favor, intenta
            nuevamente.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (paymentMethods.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
              <span className="text-2xl">💳</span>
            </div>
          </EmptyMedia>
          <EmptyTitle>No hay métodos de pago</EmptyTitle>
          <EmptyDescription>
            No se encontraron métodos de pago. Crea el primer método de pago
            para comenzar.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <PaymentMethodCreateButton />
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <div className="space-y-4">
      {/* Vista de tabla */}
      <div className="hidden md:block">
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
      </div>

      {/* Vista de cards para tablet */}
      <div className="hidden sm:block md:hidden">{renderCardsView()}</div>

      {/* Vista de lista para móvil */}
      <div className="block sm:hidden">{renderListView()}</div>
    </div>
  )
}
