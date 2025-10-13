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
import { ChevronLeft, ChevronRight, User, GraduationCap } from 'lucide-react'
import { StaffSpecialtyActions } from './staff-specialty-actions'
import useStaffSpecialties from '@/hooks/staff-specialties/use-staff-specialty-list'
import { StaffSpecialtyFilters } from '@/schemas/staff-specialties.schema'
import { Tables } from '@/types/supabase.types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

type StaffSpecialty = Tables<'staff_specialties'> & {
  staff?: {
    id: string
    full_name: string
    email: string | null
    is_active: boolean
  }
  specialties?: {
    id: string
    name: string
    is_active: boolean
  }
}

interface StaffSpecialtyListProps {
  filters?: StaffSpecialtyFilters
}

export function StaffSpecialtyList({ filters }: StaffSpecialtyListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('table')

  const { data: staffSpecialties = [], isLoading } = useStaffSpecialties(filters)

  const columns: ColumnDef<StaffSpecialty>[] = [
    {
      accessorKey: 'staff.full_name',
      header: 'Staff',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.staff?.full_name}</div>
      ),
    },
    {
      accessorKey: 'specialties.name',
      header: 'Especialidad',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.specialties?.name}</div>
      ),
    },
    {
      accessorKey: 'staff.email',
      header: 'Email',
      cell: ({ row }) => {
        const email = row.original.staff?.email
        return email || '-'
      },
    },
    {
      accessorKey: 'staff.is_active',
      header: 'Estado Staff',
      cell: ({ row }) => {
        const isActive = row.original.staff?.is_active
        return (
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? 'Activo' : 'Inactivo'}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'specialties.is_active',
      header: 'Estado Especialidad',
      cell: ({ row }) => {
        const isActive = row.original.specialties?.is_active
        return (
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? 'Activa' : 'Inactiva'}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Fecha de Asignación',
      cell: ({ row }) => {
        const date = row.getValue('created_at') as string
        return format(new Date(date), 'dd/MM/yyyy', { locale: es })
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <StaffSpecialtyActions staffSpecialty={row.original} />
      ),
    },
  ]

  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: staffSpecialties,
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
    (headerGroup: HeaderGroup<StaffSpecialty>) => (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map((header: Header<StaffSpecialty, unknown>) => (
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
    (row: Row<StaffSpecialty>) => (
      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
        {row.getVisibleCells().map((cell: Cell<StaffSpecialty, unknown>) => (
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
      {staffSpecialties.map((staffSpecialty) => (
        <Card
          key={`${staffSpecialty.staff_id}-${staffSpecialty.specialty_id}`}
          className="hover:shadow-md transition-shadow"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                {staffSpecialty.staff?.full_name}
              </CardTitle>
              <StaffSpecialtyActions staffSpecialty={staffSpecialty} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">
                  Especialidad:
                </span>
                <div className="mt-1 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-green-600" />
                  <span className="font-medium">
                    {staffSpecialty.specialties?.name}
                  </span>
                  <Badge
                    variant={
                      staffSpecialty.specialties?.is_active
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {staffSpecialty.specialties?.is_active
                      ? 'Activa'
                      : 'Inactiva'}
                  </Badge>
                </div>
              </div>

              <div>
                <span className="font-medium text-muted-foreground">
                  Estado del Staff:
                </span>
                <div className="mt-1">
                  <Badge
                    variant={
                      staffSpecialty.staff?.is_active ? 'default' : 'secondary'
                    }
                  >
                    {staffSpecialty.staff?.is_active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </div>

              {staffSpecialty.staff?.email && (
                <div>
                  <span className="font-medium text-muted-foreground">
                    Email:
                  </span>
                  <p className="mt-1">{staffSpecialty.staff.email}</p>
                </div>
              )}

              <div>
                <span className="font-medium text-muted-foreground">
                  Asignado:
                </span>
                <p className="mt-1">
                  {format(new Date(staffSpecialty.created_at), 'dd/MM/yyyy', {
                    locale: es,
                  })}
                </p>
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
      {staffSpecialties.map((staffSpecialty) => (
        <Item key={`${staffSpecialty.staff_id}-${staffSpecialty.specialty_id}`} variant="outline">
          <ItemContent>
            <ItemTitle className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-600" />
              {staffSpecialty.staff?.full_name}
            </ItemTitle>
            <ItemDescription className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-green-600" />
              {staffSpecialty.specialties?.name}
              <Badge
                variant={
                  staffSpecialty.specialties?.is_active
                    ? 'default'
                    : 'secondary'
                }
                className="text-xs"
              >
                {staffSpecialty.specialties?.is_active ? 'Activa' : 'Inactiva'}
              </Badge>
            </ItemDescription>
            <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
              {staffSpecialty.staff?.email && (
                <span>Email: {staffSpecialty.staff.email}</span>
              )}
              <span>
                Asignado: {format(new Date(staffSpecialty.created_at), 'dd/MM/yyyy', { locale: es })}
              </span>
              <Badge
                variant={
                  staffSpecialty.staff?.is_active ? 'default' : 'secondary'
                }
                className="text-xs"
              >
                Staff {staffSpecialty.staff?.is_active ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
          </ItemContent>
          <ItemActions>
            <StaffSpecialtyActions staffSpecialty={staffSpecialty} />
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  )

  if (isLoading) {
    return <TableSkeleton variant={viewMode} />
  }

  if (!staffSpecialties || staffSpecialties.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No hay asignaciones</EmptyTitle>
          <EmptyDescription>
            No se encontraron asignaciones de especialidades con los filtros
            aplicados.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controles de vista */}
      <div className="flex justify-end">
        <ViewModeToggle onValueChange={setViewMode} resource="staff-specialties" />
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
                staffSpecialties.length
              )}{' '}
              de {staffSpecialties.length} asignaciones
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
