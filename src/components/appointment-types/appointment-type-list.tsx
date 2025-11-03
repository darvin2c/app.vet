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
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
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
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AppointmentTypeActions } from './appointment-type-actions'
import { useAppointmentTypeList as useAppointmentTypes } from '@/hooks/appointment-types/use-appointment-type-list'
import type { Tables } from '@/types/supabase.types'

type AppointmentType = Tables<'appointment_types'>

interface AppointmentTypeListProps {
  searchTerm?: string
  filters?: Record<string, string | number | boolean>
}

export function AppointmentTypeList({
  searchTerm,
  filters,
}: AppointmentTypeListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('table')

  const { data: appointmentTypes = [], isLoading } = useAppointmentTypes({
    search: searchTerm,
    ...filters,
  })

  const handleEdit = useCallback(() => {
    // Handle edit logic
  }, [])

  const handleDelete = useCallback(() => {
    // Handle delete logic
  }, [])

  const columns: ColumnDef<AppointmentType>[] = [
    {
      accessorKey: 'name',
      header: 'Nombre',
      cell: ({ row }) => {
        const appointmentType = row.original
        return (
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full border"
              style={{ backgroundColor: appointmentType.color || '#3B82F6' }}
            />
            <span className="font-medium">{appointmentType.name}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'description',
      header: 'Descripción',
      cell: ({ row }) => {
        const description = row.getValue('description') as string
        return description ? (
          <span className="text-sm text-muted-foreground">{description}</span>
        ) : (
          '-'
        )
      },
    },
    {
      accessorKey: 'is_active',
      header: 'Estado',
      cell: ({ row }) => {
        const active = row.getValue('is_active') as boolean
        return (
          <Badge variant={active ? 'default' : 'secondary'}>
            {active ? 'Activo' : 'Inactivo'}
          </Badge>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <AppointmentTypeActions
          appointmentType={row.original}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ),
    },
  ]

  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: appointmentTypes,
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
    (headerGroup: HeaderGroup<AppointmentType>) => (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map((header: Header<AppointmentType, unknown>) => (
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
    (row: Row<AppointmentType>) => (
      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
        {row.getVisibleCells().map((cell: Cell<AppointmentType, unknown>) => (
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
      {appointmentTypes.map((appointmentType) => (
        <Card
          key={appointmentType.id}
          className="hover:shadow-md transition-shadow"
        >
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{
                      backgroundColor: appointmentType.color || '#3B82F6',
                    }}
                  />
                  <h3 className="font-medium">{appointmentType.name}</h3>
                </div>
                <AppointmentTypeActions
                  appointmentType={appointmentType}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      appointmentType.is_active ? 'default' : 'secondary'
                    }
                  >
                    {appointmentType.is_active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
                {appointmentType.description && (
                  <p className="text-sm text-muted-foreground">
                    {appointmentType.description}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  // Función para renderizar vista de lista
  const renderListView = () => (
    <ItemGroup className="space-y-2">
      {appointmentTypes.map((appointmentType) => (
        <Item key={appointmentType.id} variant="outline">
          <ItemContent>
            <ItemTitle>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full border"
                  style={{
                    backgroundColor: appointmentType.color || '#3B82F6',
                  }}
                />
                {appointmentType.name}
              </div>
            </ItemTitle>
            <ItemDescription>
              {appointmentType.description || 'Sin descripción'}
            </ItemDescription>
            <div className="flex gap-2 mt-2">
              <Badge
                variant={appointmentType.is_active ? 'default' : 'secondary'}
              >
                {appointmentType.is_active ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
          </ItemContent>
          <ItemActions>
            <AppointmentTypeActions
              appointmentType={appointmentType}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  )

  if (isLoading) {
    return <TableSkeleton variant={viewMode} />
  }

  if (appointmentTypes.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No hay tipos de cita</EmptyTitle>
          <EmptyDescription>
            No se encontraron tipos de cita con los criterios de búsqueda.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controles de vista */}
      <div className="flex justify-end">
        <ViewModeToggle
          onValueChange={setViewMode}
          resource="appointment-types"
        />
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
                appointmentTypes.length
              )}{' '}
              de {appointmentTypes.length} tipos de cita
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
