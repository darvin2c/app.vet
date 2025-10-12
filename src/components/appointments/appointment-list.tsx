'use client'

import { useState, useCallback } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import { Empty } from '@/components/ui/empty'
import { AppointmentActions } from './appointment-actions'
import { useAppointments } from '@/hooks/appointments/use-appointments'
import type { Tables } from '@/types/supabase.types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

type Appointment = Tables<'appointments'> & {
  patients?: { first_name: string; last_name: string } | null
  staff?: { first_name: string; last_name: string } | null
  appointment_types?: { name: string; color: string | null } | null
  procedures?: { name: string } | null
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
  const [view, setView] = useState<'table' | 'card'>('table')

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
      accessorKey: 'start_time',
      header: 'Fecha y Hora',
      cell: ({ row }) => {
        const datetime = row.getValue('start_time') as string
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
      accessorKey: 'patients',
      header: 'Paciente',
      cell: ({ row }) => {
        const patient = row.getValue('patients') as Appointment['patients']
        return patient ? `${patient.first_name} ${patient.last_name}` : '-'
      },
    },
    {
      accessorKey: 'staff',
      header: 'Personal',
      cell: ({ row }) => {
        const staff = row.getValue('staff') as Appointment['staff']
        return staff ? `${staff.first_name} ${staff.last_name}` : '-'
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
      accessorKey: 'end_time',
      header: 'Hora Fin',
      cell: ({ row }) => {
        const endTime = row.getValue('end_time') as string
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

  const table = useReactTable({
    data: appointments,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) {
    return <TableSkeleton />
  }

  if (appointments.length === 0) {
    return (
      <Empty>
        <div className="text-center">
          <h3 className="text-lg font-medium">No hay citas</h3>
          <p className="text-muted-foreground">
            No se encontraron citas con los criterios de búsqueda.
          </p>
        </div>
      </Empty>
    )
  }

  if (view === 'card') {
    return (
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
                        new Date(appointment.start_time),
                        'dd/MM/yyyy HH:mm',
                        { locale: es }
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Hasta:{' '}
                      {format(new Date(appointment.end_time), 'HH:mm', {
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
                      {appointment.patients
                        ? `${appointment.patients.first_name} ${appointment.patients.last_name}`
                        : '-'}
                    </span>
                  </div>

                  <div>
                    <span className="text-sm font-medium">Personal: </span>
                    <span className="text-sm">
                      {appointment.staff
                        ? `${appointment.staff.first_name} ${appointment.staff.last_name}`
                        : '-'}
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
  }

  return (
    <div className="rounded-md border">
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
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No hay resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
