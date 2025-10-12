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
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
import { AppointmentTypeActions } from './appointment-type-actions'
import { useAppointmentTypes } from '@/hooks/appointment-types/use-appointment-types'
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
  const [view, setView] = useState<'table' | 'card'>('table')

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
      accessorKey: 'code',
      header: 'Código',
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono">
          {row.getValue('code')}
        </Badge>
      ),
    },
    {
      accessorKey: 'active',
      header: 'Estado',
      cell: ({ row }) => {
        const active = row.getValue('active') as boolean
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

  const table = useReactTable({
    data: appointmentTypes,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) {
    return <TableSkeleton />
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

  if (view === 'card') {
    return (
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
                    <Badge variant="outline" className="font-mono text-xs">
                      {appointmentType.name}
                    </Badge>
                    <Badge
                      variant={
                        appointmentType.is_active ? 'default' : 'secondary'
                      }
                    >
                      {appointmentType.is_active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
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
