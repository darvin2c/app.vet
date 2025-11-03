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
import { Tables } from '@/types/supabase.types'
import { StaffActions } from './staff-actions'
import { getStaffFullName, getStaffInitials } from '@/lib/staff-utils'

// Tipo extendido para staff con especialidades
type StaffWithSpecialties = Tables<'staff'> & {
  specialties: Array<{
    id: string
    name: string
  }>
  staff_specialties: Array<{
    specialty_id: string
    specialties: {
      id: string
      name: string
      is_active: boolean
    }
  }>
}
import { PhoneDisplay } from '@/components/ui/phone-input'
import { IsActiveDisplay } from '@/components/ui/is-active-field'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Table2,
  Grid3X3,
  List,
} from 'lucide-react'
import useStaff from '@/hooks/staff/use-staff-list'
import type { FilterConfig } from '@/components/ui/filters'
import type { OrderByConfig } from '@/components/ui/order-by'

type ViewMode = 'table' | 'cards' | 'list'

interface StaffListProps {
  filterConfig?: FilterConfig[]
  orderByConfig?: OrderByConfig
}

export function StaffList({ filterConfig, orderByConfig }: StaffListProps) {
  // Estado para controlar la vista actual
  const [viewMode, setViewMode] = useState<ViewMode>('table')

  // Usar el hook useStaff con los filtros aplicados
  const { data: staff = [], isLoading, error } = useStaff({})

  const columns: ColumnDef<StaffWithSpecialties>[] = [
    {
      accessorKey: 'first_name',
      header: 'Nombre',
      cell: ({ row }) => (
        <div className="font-medium">{getStaffFullName(row.original)}</div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }: { row: Row<StaffWithSpecialties> }) => (
        <div className="text-sm text-muted-foreground">
          {row.getValue('email') || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Teléfono',
      cell: ({ row }: { row: Row<StaffWithSpecialties> }) => {
        const phone = row.getValue('phone') as string
        return phone ? (
          <PhoneDisplay value={phone} />
        ) : (
          <div className="text-sm text-muted-foreground">-</div>
        )
      },
    },
    {
      accessorKey: 'specialties',
      header: 'Especialidades',
      cell: ({ row }: { row: Row<StaffWithSpecialties> }) => {
        const specialties = row.original.specialties as any[]
        return specialties && specialties.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {specialties.map((specialty: any) => (
              <Badge key={specialty.id} variant="secondary" className="text-xs">
                {specialty.name}
              </Badge>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">-</div>
        )
      },
    },
    {
      accessorKey: 'license_number',
      header: 'Licencia',
      cell: ({ row }: { row: Row<StaffWithSpecialties> }) => (
        <div className="text-sm text-muted-foreground">
          {row.getValue('license_number') || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'is_active',
      header: 'Estado',
      cell: ({ row }: { row: Row<StaffWithSpecialties> }) => {
        const isActive = row.getValue('is_active') as boolean
        return <IsActiveDisplay value={isActive ?? undefined} />
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Fecha de Registro',
      cell: ({ row }: { row: Row<StaffWithSpecialties> }) => {
        const date = new Date(row.getValue('created_at'))
        return (
          <div className="text-sm text-muted-foreground">
            {date.toLocaleDateString('es-ES')}
          </div>
        )
      },
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }: { row: Row<StaffWithSpecialties> }) => (
        <StaffActions staff={row.original} />
      ),
    },
  ]

  const table = useReactTable({
    data: staff,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center h-32 text-destructive">
          Error al cargar staff: {error.message}
        </div>
      </div>
    )
  }

  // loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Botones de vista */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            <Table2 className="h-4 w-4 mr-2" />
            Tabla
          </Button>
          <Button
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('cards')}
          >
            <Grid3X3 className="h-4 w-4 mr-2" />
            Tarjetas
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4 mr-2" />
            Lista
          </Button>
        </div>
        <TableSkeleton
          variant={viewMode}
          rows={5}
          columns={8}
          showHeader={true}
        />
      </div>
    )
  }

  // empty state
  if (staff.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Users />
          </EmptyMedia>
          <EmptyTitle>No hay miembros del staff</EmptyTitle>
          <EmptyDescription>
            No se encontraron miembros del staff. Crea el primer miembro para
            comenzar.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  // Función para renderizar el contenido según la vista
  const renderContent = () => {
    const paginatedStaff = table.getRowModel().rows.map((row) => row.original)

    if (viewMode === 'cards') {
      return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginatedStaff.map((staffMember) => (
            <div
              key={staffMember.id}
              className="rounded-lg border bg-card p-4 space-y-3"
            >
              {/* Header de la tarjeta */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium text-sm">
                    {getStaffFullName(staffMember)}
                  </h3>
                  {staffMember.specialties &&
                    staffMember.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {staffMember.specialties.map((specialty: any) => (
                          <Badge
                            key={specialty.id}
                            variant="secondary"
                            className="text-xs"
                          >
                            {specialty.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                </div>
                <StaffActions staff={staffMember} />
              </div>

              {/* Información de contacto */}
              <div className="space-y-2 text-sm text-muted-foreground">
                {staffMember.email && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs">📧</span>
                    <span className="truncate">{staffMember.email}</span>
                  </div>
                )}
                {staffMember.phone && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs">📱</span>
                    <PhoneDisplay value={staffMember.phone} />
                  </div>
                )}
                {staffMember.license_number && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs">🆔</span>
                    <span>{staffMember.license_number}</span>
                  </div>
                )}
              </div>

              {/* Footer de la tarjeta */}
              <div className="flex items-center justify-between pt-2 border-t">
                <IsActiveDisplay value={staffMember.is_active ?? undefined} />
                <div className="text-xs text-muted-foreground">
                  {new Date(staffMember.created_at).toLocaleDateString('es-ES')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (viewMode === 'list') {
      return (
        <div className="space-y-3">
          {paginatedStaff.map((staffMember) => (
            <div
              key={staffMember.id}
              className="flex items-center space-x-4 rounded-lg border bg-card p-4 hover:bg-muted/50 transition-colors"
            >
              {/* Avatar */}
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-primary">
                  {getStaffInitials(staffMember)}
                </span>
              </div>

              {/* Información principal */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground truncate">
                    {getStaffFullName(staffMember)}
                  </p>
                  {staffMember.specialties &&
                    staffMember.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {staffMember.specialties.map((specialty: any) => (
                          <Badge
                            key={specialty.id}
                            variant="secondary"
                            className="text-xs"
                          >
                            {specialty.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                </div>
                <div className="flex items-center gap-4 mt-1">
                  {staffMember.email && (
                    <p className="text-sm text-muted-foreground truncate">
                      {staffMember.email}
                    </p>
                  )}
                  {staffMember.phone && (
                    <PhoneDisplay
                      value={staffMember.phone}
                      className="text-sm"
                    />
                  )}
                  {staffMember.license_number && (
                    <p className="text-sm text-muted-foreground">
                      Lic: {staffMember.license_number}
                    </p>
                  )}
                </div>
              </div>

              {/* Estado y acciones */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                <IsActiveDisplay value={staffMember.is_active ?? undefined} />
                <StaffActions staff={staffMember} />
              </div>
            </div>
          ))}
        </div>
      )
    }

    // Vista de tabla por defecto
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table
              .getHeaderGroups()
              .map((headerGroup: HeaderGroup<StaffWithSpecialties>) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(
                    (header: Header<StaffWithSpecialties, unknown>) => (
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
              ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: Row<StaffWithSpecialties>) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row
                    .getVisibleCells()
                    .map((cell: Cell<StaffWithSpecialties, unknown>) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="p-0">
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Users />
                      </EmptyMedia>
                      <EmptyTitle>No hay miembros del staff</EmptyTitle>
                      <EmptyDescription>
                        No se encontraron miembros del staff. Crea el primer
                        miembro para comenzar.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Botones de vista */}
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === 'table' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('table')}
        >
          <Table2 className="h-4 w-4 mr-2" />
          Tabla
        </Button>
        <Button
          variant={viewMode === 'cards' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('cards')}
        >
          <Grid3X3 className="h-4 w-4 mr-2" />
          Tarjetas
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('list')}
        >
          <List className="h-4 w-4 mr-2" />
          Lista
        </Button>
      </div>

      {/* Contenido principal */}
      {renderContent()}

      {/* Paginación */}
      {staff.length > 0 && (
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
              staff.length
            )}{' '}
            de {staff.length} miembros del staff
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
      )}
    </div>
  )
}
