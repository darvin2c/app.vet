'use client'

import { useMemo } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Clock } from 'lucide-react'
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
import type { AppointmentType } from '@/types/supabase.types'
// added imports for filters/search/orderBy
import { useFilters } from '@/components/ui/filters'
import { useOrderBy } from '@/components/ui/order-by/use-order-by'
import type { FilterConfig } from '@/components/ui/filters'
import type { OrderByConfig } from '@/components/ui/order-by'
import { useSearch } from '@/hooks/use-search'
import { OrderByTableHeader } from '@/components/ui/order-by'

interface AppointmentTypeListProps {
  filterConfig: FilterConfig[]
  orderByConfig: OrderByConfig
  search?: string
  view?: 'table' | 'cards' | 'list'
  onSuccess?: () => void
}

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

  const { data: appointmentTypes = [], isLoading } = useAppointmentTypeList({
    filters: appliedFilters,
    search: appliedSearch,
    orders: orderByHook.appliedSorts,
  })

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
        accessorKey: 'code',
        header: 'Código',
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.code || '-'}
          </span>
        ),
      },
      {
        accessorKey: 'duration_minutes',
        header: ({ header }) => (
          <OrderByTableHeader
            field="duration_minutes"
            orderByHook={orderByHook}
          >
            Duración
          </OrderByTableHeader>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-1 text-sm">
            <Clock className="h-3 w-3" />
            {row.original.duration_minutes} min
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
        cell: ({ row }) => (
          <Badge variant={row.original.is_active ? 'default' : 'secondary'}>
            {row.original.is_active ? 'Activo' : 'Inactivo'}
          </Badge>
        ),
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

  if (view === 'cards') {
    return (
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

            {appointmentType.code && (
              <p className="text-sm text-muted-foreground mb-2">
                Código: {appointmentType.code}
              </p>
            )}

            {appointmentType.description && (
              <p className="text-sm text-muted-foreground mb-3">
                {appointmentType.description}
              </p>
            )}

            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
              <Clock className="h-3 w-3" />
              {appointmentType.duration_minutes} minutos
            </div>

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
  }

  if (view === 'list') {
    return (
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
                {appointmentType.code && (
                  <div className="text-sm text-muted-foreground">
                    Código: {appointmentType.code}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {appointmentType.duration_minutes} min
                </div>
                <Badge
                  variant={appointmentType.is_active ? 'default' : 'secondary'}
                >
                  {appointmentType.is_active ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </div>
            <AppointmentTypeActions
              appointmentType={appointmentType}
              onSuccess={onSuccess}
            />
          </Item>
        ))}
      </ItemGroup>
    )
  }

  return (
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
}
