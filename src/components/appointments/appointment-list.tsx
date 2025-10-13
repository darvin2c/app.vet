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
import { AppointmentActions } from './appointment-actions'
import { useAppointments } from '@/hooks/appointments/use-appointments'
import type { Tables } from '@/types/supabase.types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

type Appointment = Tables<'appointments'> & {
  pets:
    | (Tables<'pets'> & {
        customers: Tables<'customers'> | null
      })
    | null
  staff: Tables<'staff'> | null
  appointment_types: Tables<'appointment_types'> | null
}

interface AppointmentListProps {
  searchTerm?: string
  filters?: Record<string, string | number | boolean>
}

const STATUS_LABELS = {
  scheduled: 'Programada',
  confirmed: 'Confirmada',
  in_progress: 'En Progreso',
  completed: 'Completada',
  cancelled: 'Cancelada',
  no_show: 'No Asistió',
} as const

const STATUS_VARIANTS = {
  scheduled: 'secondary',
  confirmed: 'default',
  in_progress: 'warning',
  completed: 'success',
  cancelled: 'destructive',
  no_show: 'outline',
} as const

export function AppointmentList({ searchTerm, filters }: AppointmentListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('table')

  const { data: appointments = [], isLoading } = useAppointments({
    search: searchTerm,
    ...filters,
  })

  const handleEdit = useCallback((appointment: Appointment) => {
    // Handle edit logic
    console.log('Edit appointment:', appointment)
  }, [])

  const handleDelete = useCallback((appointment: Appointment) => {
    // Handle delete logic
    console.log('Delete appointment:', appointment)
  }, [])

  const columns: ColumnDef<Appointment>[] = [
    {
      accessorKey: 'scheduled_start',
      header: 'Fecha y Hora',
      cell: ({ row }) => {
        const datetime = row.getValue('scheduled_start') as string
        return (
          <div className="space-y-1">
            <div className="font-medium">
              {format(new Date(datetime), 'dd/MM/yyyy', { locale: es })}
            </div>
            <div className="text-sm text-muted-foreground">
              {format(new Date(datetime), 'HH:mm', { locale: es })}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'pets',
      header: 'Paciente',
      cell: ({ row }) => {
        const patient = row.getValue('pets') as Appointment['pets']
        return patient ? patient.name : '-'
      },
    },
    {
      accessorKey: 'staff',
      header: 'Personal',
      cell: ({ row }) => {
        const staff = row.getValue('staff') as Appointment['staff']
        return staff ? staff.full_name : '-'
      },
    },
    {
      accessorKey: 'appointment_types',
      header: 'Tipo',
      cell: ({ row }) => {
        const type = row.getValue(
          'appointment_types'
        ) as Appointment['appointment_types']
        return type ? (
          <Badge
            variant="outline"
            style={{
              borderColor: type.color || '#3B82F6',
              color: type.color || '#3B82F6',
            }}
          >
            {type.name}
          </Badge>
        ) : (
          '-'
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => {
        const status = row.getValue('status') as keyof typeof STATUS_LABELS
        return (
          <Badge variant={STATUS_VARIANTS[status] as any}>
            {STATUS_LABELS[status]}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'scheduled_end',
      header: 'Hora Fin',
      cell: ({ row }) => {
        const endTime = row.getValue('scheduled_end') as string
        return format(new Date(endTime), 'HH:mm', { locale: es })
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <AppointmentActions
          appointment={row.original}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ),
    },
  ]

  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: appointments,
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
    (headerGroup: HeaderGroup<Appointment>) => (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map((header: Header<Appointment, unknown>) => (
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
    (row: Row<Appointment>) => (
      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
        {row.getVisibleCells().map((cell: Cell<Appointment, unknown>) => (
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
      {appointments.map((appointment: Appointment) => (
        <Card
          key={appointment.id}
          className="hover:shadow-md transition-shadow"
        >
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">
                    {format(
                      new Date(appointment.scheduled_start),
                      'dd/MM/yyyy HH:mm',
                      { locale: es }
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Hasta:{' '}
                    {format(new Date(appointment.scheduled_end), 'HH:mm', {
                      locale: es,
                    })}
                  </div>
                </div>
                <Badge
                  variant={
                    STATUS_VARIANTS[
                      appointment.status as keyof typeof STATUS_VARIANTS
                    ] as 'default' | 'secondary' | 'destructive' | 'outline'
                  }
                >
                  {
                    STATUS_LABELS[
                      appointment.status as keyof typeof STATUS_LABELS
                    ]
                  }
                </Badge>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium">Paciente: </span>
                  <span className="text-sm">
                    {appointment.pets ? appointment.pets.name : '-'}
                  </span>
                </div>

                <div>
                  <span className="text-sm font-medium">Personal: </span>
                  <span className="text-sm">
                    {appointment.staff ? appointment.staff.full_name : '-'}
                  </span>
                </div>

                {appointment.appointment_types && (
                  <div>
                    <span className="text-sm font-medium">Tipo: </span>
                    <Badge
                      variant="outline"
                      style={{
                        borderColor:
                          appointment.appointment_types.color || undefined,
                        color:
                          appointment.appointment_types.color || undefined,
                      }}
                      className="text-xs"
                    >
                      {appointment.appointment_types.name}
                    </Badge>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <AppointmentActions
                  appointment={appointment}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
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
      {appointments.map((appointment) => (
        <Item key={appointment.id} variant="outline">
          <ItemContent>
            <ItemTitle>
              {format(
                new Date(appointment.scheduled_start),
                'dd/MM/yyyy HH:mm',
                { locale: es }
              )}
            </ItemTitle>
            <ItemDescription>
              {appointment.pets ? `Paciente: ${appointment.pets.name}` : 'Sin paciente'} • 
              {appointment.staff ? `Personal: ${appointment.staff.full_name}` : 'Sin personal'}
            </ItemDescription>
            <div className="flex gap-2 mt-2">
              <Badge
                variant={
                  STATUS_VARIANTS[
                    appointment.status as keyof typeof STATUS_VARIANTS
                  ] as any
                }
              >
                {STATUS_LABELS[appointment.status as keyof typeof STATUS_LABELS]}
              </Badge>
              {appointment.appointment_types && (
                <Badge
                  variant="outline"
                  style={{
                    borderColor: appointment.appointment_types.color || undefined,
                    color: appointment.appointment_types.color || undefined,
                  }}
                >
                  {appointment.appointment_types.name}
                </Badge>
              )}
            </div>
          </ItemContent>
          <ItemActions>
            <AppointmentActions
              appointment={appointment}
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

  if (appointments.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No hay citas</EmptyTitle>
          <EmptyDescription>
            No se encontraron citas con los criterios de búsqueda.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controles de vista */}
      <div className="flex justify-end">
        <ViewModeToggle onValueChange={setViewMode} resource="appointments" />
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
                appointments.length
              )}{' '}
              de {appointments.length} citas
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
