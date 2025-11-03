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
import { Badge } from '@/components/ui/badge'
import { Database } from '@/types/supabase.types'
import { PaymentMethodActions } from './payment-method-actions'
import { PaymentMethodCreateButton } from './payment-method-create-button'
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
  CreditCard,
} from 'lucide-react'
import { usePaymentMethodList } from '@/hooks/payment-methods/use-payment-method-list'
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

type PaymentMethod = Database['public']['Tables']['payment_methods']['Row']

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

export function PaymentMethodList({
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
    data: paymentMethods = [],
    isPending,
    error,
  } = usePaymentMethodList()

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

  // Función para renderizar el encabezado de la tabla
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

  // Función para renderizar las filas de la tabla
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

  // Función para renderizar vista de tarjetas
  const renderCardsView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {paymentMethods.map((paymentMethod) => (
        <Card key={paymentMethod.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{paymentMethod.name}</h3>
                <p className="text-sm font-mono text-muted-foreground">
                  {paymentMethod.code}
                </p>

              </div>
              <PaymentMethodActions paymentMethod={paymentMethod} />
            </div>

            <div className="flex justify-between items-center">
              <Badge className={paymentTypeColors[paymentMethod.payment_type as keyof typeof paymentTypeColors]}>
                {paymentTypeLabels[paymentMethod.payment_type as keyof typeof paymentTypeLabels]}
              </Badge>
              <IsActiveDisplay value={paymentMethod.is_active} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  // Función para renderizar vista de lista
  const renderListView = () => (
    <ItemGroup className="space-y-2">
      {paymentMethods.map((paymentMethod) => (
        <Item key={paymentMethod.id} variant="outline">
          <ItemContent>
            <ItemTitle>{paymentMethod.name}</ItemTitle>
            <ItemDescription>
              {paymentMethod.code}
            </ItemDescription>
            <div className="flex gap-4 text-sm text-muted-foreground mt-2">
              <Badge className={paymentTypeColors[paymentMethod.payment_type as keyof typeof paymentTypeColors]}>
                {paymentTypeLabels[paymentMethod.payment_type as keyof typeof paymentTypeLabels]}
              </Badge>
              <IsActiveDisplay value={paymentMethod.is_active} />
            </div>
          </ItemContent>
          <ItemActions>
            <PaymentMethodActions paymentMethod={paymentMethod} />
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
          Error al cargar métodos de pago: {error.message}
        </p>
      </div>
    )
  }

  if (paymentMethods.length === 0) {
    return (
      <div className="flex items-center justify-center text-muted-foreground h-[calc(100vh-100px)]">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CreditCard className="h-16 w-16" />
            </EmptyMedia>
            <EmptyTitle>No hay métodos de pago</EmptyTitle>
            <EmptyDescription>
              No se encontraron métodos de pago que coincidan con los filtros
              aplicados.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <PaymentMethodCreateButton>Crear Método de Pago</PaymentMethodCreateButton>
              <Button variant="outline">Importar Método de Pago</Button>
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
        <ViewModeToggle onValueChange={setViewMode} resource="payment-methods" />
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
                paymentMethods.length
              )}{' '}
              de {paymentMethods.length} métodos de pago
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
