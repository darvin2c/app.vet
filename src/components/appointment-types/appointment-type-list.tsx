'use client'

import { useMemo } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { useAppointmentTypeList } from '@/hooks/appointment-types/use-appointment-type-list'
import { AppointmentTypeActions } from './appointment-type-actions'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Item, ItemGroup } from '@/components/ui/item'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
// added imports for filters/search/orderBy
import { useFilters } from '@/components/ui/filters'
import { useOrderBy } from '@/components/ui/order-by/use-order-by'
import type { FilterConfig } from '@/components/ui/filters'
import type { OrderByConfig } from '@/components/ui/order-by'
import { useSearch } from '@/hooks/use-search'
import { OrderByTableHeader } from '@/components/ui/order-by'
import { Tables } from '@/types/supabase.types'
import { Pagination, usePagination } from '../ui/pagination'
import { IsActiveDisplay } from '../ui/is-active-field'

interface AppointmentTypeListProps {
  filterConfig: FilterConfig[]
  orderByConfig: OrderByConfig
  search?: string
  view?: 'table' | 'cards' | 'list'
  onSuccess?: () => void
}

type AppointmentType = Tables<'appointment_types'>

export function AppointmentTypeList({
  filterConfig,
  orderByConfig,
  view = 'table',
  onSuccess,
}: AppointmentTypeListProps) {
  // derive filters, sorts and search from UI hooks
  const { appliedFilters } = useFilters(filterConfig)
  const orderByHook = useOrderBy(orderByConfig)
  const { appliedSearch } = useSearch()
  const { appliedPagination, paginationProps } = usePagination()

  const { data, isLoading } = useAppointmentTypeList({
    filters: appliedFilters,
    search: appliedSearch,
    orders: orderByHook.appliedSorts,
    pagination: appliedPagination,
  })

  const appointmentTypes = data?.data || []

  const columns = useMemo<ColumnDef<AppointmentType>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ header }) => (
          <OrderByTableHeader field="name" orderByHook={orderByHook}>
            Nombre
          </OrderByTableHeader>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full border"
              style={{ backgroundColor: row.original.color || 'transparent' }}
            />
            <span className="font-medium">{row.original.name}</span>
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
        cell: ({ row }) => <IsActiveDisplay value={row.original.is_active} />,
      },
      {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => (
          <AppointmentTypeActions
            appointmentType={row.original}
            onSuccess={onSuccess}
          />
        ),
      },
    ],
    [onSuccess, orderByHook]
  )

  const table = useReactTable({
    data: appointmentTypes,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) {
    return <TableSkeleton columns={columns.length} />
  }

  if (appointmentTypes.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No hay tipos de cita</EmptyTitle>
          <EmptyDescription>
            Crea tu primer tipo de cita para empezar a organizar tus citas
            médicas.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  const renderCardsView = (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {appointmentTypes.map((appointmentType) => (
        <Card key={appointmentType.id} className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border"
                style={{
                  backgroundColor: appointmentType.color || 'transparent',
                }}
              />
              <h3 className="font-semibold">{appointmentType.name}</h3>
            </div>
            <Badge
              variant={appointmentType.is_active ? 'default' : 'secondary'}
            >
              {appointmentType.is_active ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>

          {appointmentType.description && (
            <p className="text-sm text-muted-foreground mb-3">
              {appointmentType.description}
            </p>
          )}

          <div className="flex justify-end">
            <AppointmentTypeActions
              appointmentType={appointmentType}
              onSuccess={onSuccess}
            />
          </div>
        </Card>
      ))}
    </div>
  )

  const renderListView = (
    <ItemGroup>
      {appointmentTypes.map((appointmentType) => (
        <Item key={appointmentType.id}>
          <div className="flex items-center gap-3 flex-1">
            <div
              className="w-4 h-4 rounded-full border"
              style={{
                backgroundColor: appointmentType.color || 'transparent',
              }}
            />
            <div className="flex-1">
              <div className="font-medium">{appointmentType.name}</div>
            </div>
            <Badge
              variant={appointmentType.is_active ? 'default' : 'secondary'}
            >
              {appointmentType.is_active ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
          <AppointmentTypeActions
            appointmentType={appointmentType}
            onSuccess={onSuccess}
          />
        </Item>
      ))}
    </ItemGroup>
  )

  const renderTableView = (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length
          ? table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          : null}
      </TableBody>
    </Table>
  )

  return (
    <div>
      {view === 'cards' && renderCardsView}
      {view === 'list' && renderListView}
      {view === 'table' && renderTableView}
      <div>
        <Pagination {...paginationProps} totalItems={data?.total} />
      </div>
    </div>
  )
}
