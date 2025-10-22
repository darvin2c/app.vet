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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
import { ViewModeToggle, ViewMode } from '@/components/ui/view-mode-toggle'
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
} from '@/components/ui/item'
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react'
import { useMedicalRecordList } from '@/hooks/medical-records/use-medical-record-list'
import { MedicalRecordActions } from './medical-record-actions'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { getStaffFullName } from '@/lib/staff-utils'
import { Tables } from '@/types/supabase.types'
import { FilterConfig } from '@/types/filters.types'
import { OrderByConfig } from '@/types/order-by.types'
import { useFilters } from '@/hooks/use-filters'
import { useOrderBy } from '@/hooks/use-order-by'
import { useSearch } from '@/hooks/use-search'
import useRecordType from '@/hooks/medical-records/use-record-type'

type MedicalRecord = Tables<'clinical_records'> & {
  pets: {
    id: string
    name: string
    microchip: string | null
  } | null
  staff: {
    id: string
    first_name: string
    last_name: string | null
  } | null
  appointments: {
    id: string
    scheduled_start: string
    reason: string | null
  } | null
}

interface MedicalRecordListProps {
  filterConfig: FilterConfig[]
  orderByConfig: OrderByConfig
}

export function MedicalRecordList({
  filterConfig,
  orderByConfig,
}: MedicalRecordListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('table')

  const { appliedFilters } = useFilters(filterConfig)
  const orderByHook = useOrderBy(orderByConfig)
  const { appliedSearch } = useSearch()
  const { getRecordType } = useRecordType()

  const {
    data: medicalRecords = [],
    isPending,
    error,
  } = useMedicalRecordList({
    filters: appliedFilters,
    search: appliedSearch,
    orders: orderByHook.appliedSorts,
  })

  const columns: ColumnDef<MedicalRecord>[] = [
    {
      accessorKey: 'pets.name',
      header: 'Mascota',
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.pets?.name || 'Sin mascota'}
        </div>
      ),
    },
    {
      accessorKey: 'record_type',
      header: 'Tipo',
      cell: ({ row }) => {
        const recordType = getRecordType(row.getValue('record_type'))
        return (
          <div className="flex items-center gap-2">
            {recordType?.icon}
            <span>{recordType?.label || row.getValue('record_type')}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => {
        const status = row.getValue('status') as string
        return (
          <Badge
            variant={
              status === 'completed'
                ? 'default'
                : status === 'draft'
                  ? 'secondary'
                  : 'outline'
            }
          >
            {status === 'completed'
              ? 'Completado'
              : status === 'draft'
                ? 'Borrador'
                : 'Cancelado'}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'record_date',
      header: 'Fecha',
      cell: ({ row }) => {
        const date = row.getValue('record_date') as string
        return date
          ? format(new Date(date), 'dd/MM/yyyy', { locale: es })
          : 'Sin fecha'
      },
    },
    {
      accessorKey: 'staff',
      header: 'Veterinario',
      cell: ({ row }) => {
        const staff = row.original.staff
        return staff ? getStaffFullName(staff) : 'Sin asignar'
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Creado',
      cell: ({ row }) => (
        <div>
          {format(new Date(row.getValue('created_at')), 'dd/MM/yyyy', {
            locale: es,
          })}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => <MedicalRecordActions medicalRecord={row.original} />,
    },
  ]

  const table = useReactTable({
    data: medicalRecords,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const renderTableHeader = useCallback(
    (headerGroup: HeaderGroup<MedicalRecord>) => (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map((header: Header<MedicalRecord, unknown>) => (
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
    (row: Row<MedicalRecord>) => (
      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
        {row.getVisibleCells().map((cell: Cell<MedicalRecord, unknown>) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ),
    []
  )

  const renderCard = useCallback(
    (record: MedicalRecord) => {
      const recordType = getRecordType(record.record_type)
      return (
        <Card key={record.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                {recordType?.icon}
                {recordType?.label || record.record_type}
              </CardTitle>
              <Badge>{recordType?.label || record.record_type}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Mascota: </span>
                {record.pets?.name || 'Sin mascota'}
              </div>
              <div>
                <span className="font-medium">Fecha: </span>
                {record.record_date
                  ? format(new Date(record.record_date), 'dd/MM/yyyy', {
                      locale: es,
                    })
                  : 'Sin fecha'}
              </div>
              <div>
                <span className="font-medium">Veterinario: </span>
                {record.staff ? getStaffFullName(record.staff) : 'Sin asignar'}
              </div>
              {record.notes && (
                <div>
                  <span className="font-medium">Notas: </span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {record.notes.length > 100
                      ? `${record.notes.substring(0, 100)}...`
                      : record.notes}
                  </p>
                </div>
              )}
              <div className="flex justify-end pt-2">
                <MedicalRecordActions medicalRecord={record} />
              </div>
            </div>
          </CardContent>
        </Card>
      )
    },
    [getRecordType]
  )

  const renderListItem = useCallback(
    (record: MedicalRecord) => {
      const recordType = getRecordType(record.record_type)
      return (
        <Item key={record.id}>
          <ItemContent>
            <div className="flex items-center gap-3">
              {recordType?.icon}
              <div className="flex-1">
                <ItemTitle>{record.pets?.name || 'Sin mascota'}</ItemTitle>
                <ItemDescription>
                  {recordType?.label || record.record_type} •{' '}
                  {record.record_date
                    ? format(new Date(record.record_date), 'dd/MM/yyyy', {
                        locale: es,
                      })
                    : 'Sin fecha'}
                  {record.staff && ` • ${getStaffFullName(record.staff)}`}
                </ItemDescription>
              </div>
              <Badge>{recordType?.label || record.record_type}</Badge>
            </div>
          </ItemContent>
          <ItemActions>
            <MedicalRecordActions medicalRecord={record} />
          </ItemActions>
        </Item>
      )
    },
    [getRecordType]
  )

  if (isPending) {
    return <TableSkeleton />
  }

  if (error) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Error al cargar registros médicos</EmptyTitle>
          <EmptyDescription>
            Ocurrió un error al cargar los registros médicos. Por favor, intenta
            nuevamente.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (medicalRecords.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <FileText className="h-12 w-12 text-muted-foreground" />
          <EmptyTitle>No hay registros médicos</EmptyTitle>
          <EmptyDescription>
            No se encontraron registros médicos. Crea el primer registro para
            comenzar.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ViewModeToggle
          onValueChange={setViewMode}
          resource="medical-records"
        />
      </div>

      {viewMode === 'table' && (
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
          <div className="flex items-center justify-end space-x-2 p-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} de{' '}
              {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
            </div>
            <div className="space-x-2">
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
        </div>
      )}

      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {medicalRecords.map(renderCard)}
        </div>
      )}

      {viewMode === 'list' && (
        <ItemGroup>{medicalRecords.map(renderListItem)}</ItemGroup>
      )}
    </div>
  )
}
