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
import { Database } from '@/types/supabase.types'
import { PatientActions } from './patient-actions'
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
import { PatientSexOptions } from '@/schemas/patients.schema'
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Table2,
  Grid3X3,
  List,
} from 'lucide-react'
import usePatients from '@/hooks/patients/use-patients'

type Patient = Database['public']['Tables']['patients']['Row']
type ViewMode = 'table' | 'cards' | 'list'

export function PatientList() {
  // Estado para controlar la vista actual
  const [viewMode, setViewMode] = useState<ViewMode>('table')

  // Usar el hook usePatients con los filtros aplicados
  const { data: patients = [], isLoading, error } = usePatients()

  const columns: ColumnDef<Patient>[] = [
    {
      accessorKey: 'first_name',
      header: 'Nombre',
      cell: ({ row }: { row: Row<Patient> }) => (
        <div className="font-medium">
          {row.getValue('first_name')} {row.original.last_name}
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }: { row: Row<Patient> }) => (
        <div className="text-sm text-muted-foreground">
          {row.getValue('email') || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Teléfono',
      cell: ({ row }: { row: Row<Patient> }) => {
        const phone = row.getValue('phone') as string
        return phone ? (
          <PhoneDisplay value={phone} />
        ) : (
          <div className="text-sm text-muted-foreground">-</div>
        )
      },
    },
    {
      accessorKey: 'sex',
      header: 'Sexo',
      cell: ({ row }: { row: Row<Patient> }) => {
        const sex = row.getValue('sex') as string
        const sexOption = PatientSexOptions.find(
          (option) => option.value === sex
        )
        return <div className="text-sm">{sexOption?.label || '-'}</div>
      },
    },
    {
      accessorKey: 'is_active',
      header: 'Estado',
      cell: ({ row }: { row: Row<Patient> }) => {
        const isActive = row.getValue('is_active') as boolean
        return <IsActiveDisplay value={isActive} />
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Fecha de Registro',
      cell: ({ row }: { row: Row<Patient> }) => {
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
      cell: ({ row }: { row: Row<Patient> }) => (
        <PatientActions patient={row.original} />
      ),
    },
  ]

  const table = useReactTable({
    data: patients,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center h-32 text-destructive">
          Error al cargar pacientes: {error.message}
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
          columns={7}
          showHeader={true}
        />
      </div>
    )
  }

  // empty state
  if (patients.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Users />
          </EmptyMedia>
          <EmptyTitle>No hay pacientes</EmptyTitle>
          <EmptyDescription>
            No se encontraron pacientes. Crea tu primer paciente para comenzar.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  // Función para renderizar el contenido según la vista
  const renderContent = () => {
    const paginatedPatients = table
      .getRowModel()
      .rows.map((row) => row.original)

    if (viewMode === 'cards') {
      return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginatedPatients.map((patient) => (
            <div
              key={patient.id}
              className="rounded-lg border bg-card p-4 space-y-3"
            >
              {/* Header de la tarjeta */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {patient.first_name?.[0]?.toUpperCase()}
                      {patient.last_name?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-sm">
                      {patient.first_name} {patient.last_name}
                    </div>
                  </div>
                </div>
                <IsActiveDisplay value={patient.is_active ?? undefined} />
              </div>

              {/* Contenido principal */}
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  <strong>Email:</strong> {patient.email || '-'}
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong>Teléfono:</strong>{' '}
                  {patient.phone ? <PhoneDisplay value={patient.phone} /> : '-'}
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong>Sexo:</strong>{' '}
                  {PatientSexOptions.find(
                    (option) => option.value === patient.sex
                  )?.label || '-'}
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong>Registro:</strong>{' '}
                  {new Date(patient.created_at).toLocaleDateString('es-ES')}
                </div>
              </div>

              {/* Footer de la tarjeta */}
              <div className="flex items-center justify-end pt-2">
                <PatientActions patient={patient} />
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (viewMode === 'list') {
      return (
        <div className="space-y-3">
          {paginatedPatients.map((patient) => (
            <div
              key={patient.id}
              className="flex items-center space-x-4 rounded-lg border bg-card p-4 hover:bg-muted/50 transition-colors"
            >
              {/* Avatar */}
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-primary">
                  {patient.first_name?.[0]?.toUpperCase()}
                  {patient.last_name?.[0]?.toUpperCase()}
                </span>
              </div>

              {/* Contenido principal */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">
                    {patient.first_name} {patient.last_name}
                  </div>
                  <IsActiveDisplay value={patient.is_active ?? undefined} />
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>{patient.email || '-'}</span>
                  <span>
                    {patient.phone ? (
                      <PhoneDisplay value={patient.phone} />
                    ) : (
                      '-'
                    )}
                  </span>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                <PatientActions patient={patient} />
              </div>
            </div>
          ))}
        </div>
      )
    }

    // Vista de tabla (por defecto)
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table
              .getHeaderGroups()
              .map((headerGroup: HeaderGroup<Patient>) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(
                    (header: Header<Patient, unknown>) => (
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
              table.getRowModel().rows.map((row: Row<Patient>) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell: Cell<Patient, unknown>) => (
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
                      <EmptyTitle>No hay pacientes</EmptyTitle>
                      <EmptyDescription>
                        No se encontraron pacientes. Crea tu primer paciente
                        para comenzar.
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

      {/* Contenido según la vista */}
      {renderContent()}

      {/* Paginación */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Mostrando {table.getRowModel().rows.length} de {patients.length}{' '}
          paciente(s)
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
    </div>
  )
}
