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
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  CalendarDays,
  User,
} from 'lucide-react'
import { MedicalRecordActions } from '../medical-records/medical-record-actions'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Tables } from '@/types/supabase.types'
import { FilterConfig } from '@/types/filters.types'
import { OrderByConfig } from '@/types/order-by.types'
import { useFilters } from '@/hooks/use-filters'
import { useOrderBy } from '@/hooks/use-order-by'
import { useSearch } from '@/hooks/use-search'
import useRecordType from '@/hooks/medical-records/use-record-type'

type PetMedicalRecord = Tables<'clinical_records'> & {
  appointments:
    | (Tables<'appointments'> & {
        appointment_types: Tables<'appointment_types'> | null
      })
    | null
  clinical_notes: Tables<'clinical_notes'>[]
  clinical_parameters: Tables<'clinical_parameters'>[]
  boardings: Tables<'boardings'>[]
}

interface PetMedicalRecordsListProps {
  petId: string
  medicalRecords: PetMedicalRecord[]
  isLoading: boolean
  filterConfig?: FilterConfig[]
  orderByConfig?: OrderByConfig
}

export function PetMedicalRecordsList({
  petId,
  medicalRecords,
  isLoading,
  filterConfig = [],
  orderByConfig,
}: PetMedicalRecordsListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('cards')
  const [sorting, setSorting] = useState<SortingState>([])

  const { appliedFilters } = useFilters(filterConfig)
  const orderByHook = useOrderBy(orderByConfig || { columns: [] })
  const { appliedSearch } = useSearch()
  const { getRecordType } = useRecordType()

  // Filtrar los registros médicos basado en filtros y búsqueda aplicados
  const filteredRecords = medicalRecords.filter((record) => {
    // Aplicar búsqueda si existe
    if (appliedSearch) {
      const searchTerm = appliedSearch.toLowerCase()
      const recordType = getRecordType(record.record_type)
      const searchableText = [
        recordType?.label || record.record_type,
        record.notes || '',
        record.created_by || '',
      ]
        .join(' ')
        .toLowerCase()

      if (!searchableText.includes(searchTerm)) {
        return false
      }
    }

    // Aplicar filtros si existen
    if (appliedFilters.length > 0) {
      return appliedFilters.every((filter) => {
        const fieldValue = record[filter.field as keyof PetMedicalRecord]
        if (filter.operator === 'eq') {
          return fieldValue === filter.value
        }
        if (filter.operator === 'contains') {
          return String(fieldValue)
            .toLowerCase()
            .includes(String(filter.value).toLowerCase())
        }
        return true
      })
    }

    return true
  })

  const columns: ColumnDef<PetMedicalRecord>[] = [
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
      accessorKey: 'created_by',
      header: 'Veterinario',
      cell: ({ row }) => {
        return row.getValue('created_by') || 'No asignado'
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
    data: filteredRecords,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
    (headerGroup: HeaderGroup<PetMedicalRecord>) => (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map(
          (header: Header<PetMedicalRecord, unknown>) => (
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

  const renderTableRow = useCallback(
    (row: Row<PetMedicalRecord>) => (
      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
        {row.getVisibleCells().map((cell: Cell<PetMedicalRecord, unknown>) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ),
    []
  )

  const renderCard = useCallback(
    (record: PetMedicalRecord) => {
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
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {record.record_date && (
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>Fecha:</strong>{' '}
                      {format(new Date(record.record_date), 'dd/MM/yyyy', {
                        locale: es,
                      })}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span className="text-sm">
                    <strong>Veterinario:</strong>{' '}
                    {record.created_by || 'No asignado'}
                  </span>
                </div>
              </div>

              {record.notes && (
                <div>
                  <h4 className="font-medium mb-2">Notas</h4>
                  <p className="text-sm text-muted-foreground">
                    {record.notes.length > 100
                      ? `${record.notes.substring(0, 100)}...`
                      : record.notes}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-muted-foreground">
                  Creado el{' '}
                  {format(new Date(record.created_at), 'dd/MM/yyyy HH:mm', {
                    locale: es,
                  })}
                </div>
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
    (record: PetMedicalRecord) => {
      const recordType = getRecordType(record.record_type)
      return (
        <Item key={record.id}>
          <ItemContent>
            <div className="flex items-center gap-3">
              {recordType?.icon}
              <div className="flex-1">
                <ItemTitle>{recordType?.label || record.record_type}</ItemTitle>
                <ItemDescription>
                  {record.record_date
                    ? format(new Date(record.record_date), 'dd/MM/yyyy', {
                        locale: es,
                      })
                    : 'Sin fecha'}{' '}
                  • {record.created_by || 'No asignado'}
                  {record.notes && ` • ${record.notes.substring(0, 50)}...`}
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

  if (isLoading) {
    return <TableSkeleton variant={viewMode} />
  }

  if (filteredRecords.length === 0 && medicalRecords.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <FileText className="h-12 w-12 text-muted-foreground" />
          <EmptyTitle>No hay registros médicos</EmptyTitle>
          <EmptyDescription>
            Esta mascota aún no tiene registros médicos en su historial.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (filteredRecords.length === 0 && medicalRecords.length > 0) {
    return (
      <Empty>
        <EmptyHeader>
          <FileText className="h-12 w-12 text-muted-foreground" />
          <EmptyTitle>No se encontraron resultados</EmptyTitle>
          <EmptyDescription>
            No hay registros médicos que coincidan con los filtros aplicados.
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
          resource="pet-medical-records"
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
          {filteredRecords.map(renderCard)}
        </div>
      )}

      {viewMode === 'list' && (
        <ItemGroup>{filteredRecords.map(renderListItem)}</ItemGroup>
      )}
    </div>
  )
}
