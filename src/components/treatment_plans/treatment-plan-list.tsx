'use client'

import { useState } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
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
import { TreatmentPlanActions } from './treatment-plan-actions'
import { TreatmentPlanStatusBadge } from './treatment-plan-status-badge'
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
  FileText,
  Table2,
  Grid3X3,
  List,
} from 'lucide-react'
import { TreatmentPlanWithRelations } from '@/hooks/treatment-plans/use-treatment-plans'
import { formatCurrency } from '@/lib/utils'

type ViewMode = 'table' | 'cards' | 'list'

interface TreatmentPlanListProps {
  treatmentPlans: TreatmentPlanWithRelations[]
  isLoading: boolean
  error?: Error | null
}

export function TreatmentPlanList({
  treatmentPlans,
  isLoading,
  error,
}: TreatmentPlanListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('table')

  const columns: ColumnDef<TreatmentPlanWithRelations>[] = [
    {
      accessorKey: 'title',
      header: 'Título',
      cell: ({ row }: { row: Row<TreatmentPlanWithRelations> }) => (
        <div className="font-medium">{row.getValue('title')}</div>
      ),
    },
    {
      accessorKey: 'patients',
      header: 'Paciente',
      cell: ({ row }: { row: Row<TreatmentPlanWithRelations> }) => {
        const patient = row.original.patients
        return (
          <div className="text-sm">
            {patient ? `${patient.first_name} ${patient.last_name}` : '-'}
          </div>
        )
      },
    },
    {
      accessorKey: 'staff',
      header: 'Responsable',
      cell: ({ row }: { row: Row<TreatmentPlanWithRelations> }) => {
        const staff = row.original.staff
        return (
          <div className="text-sm">
            {staff ? `${staff.first_name} ${staff.last_name}` : '-'}
          </div>
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }: { row: Row<TreatmentPlanWithRelations> }) => {
        const status = row.getValue('status') as any
        return <TreatmentPlanStatusBadge status={status} />
      },
    },
    {
      accessorKey: 'total',
      header: 'Costo Total',
      cell: ({ row }: { row: Row<TreatmentPlanWithRelations> }) => {
        const totalCost = row.getValue('total') as number
        return (
          <div className="text-sm font-medium">
            {formatCurrency(totalCost || 0)}
          </div>
        )
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Fecha de Creación',
      cell: ({ row }: { row: Row<TreatmentPlanWithRelations> }) => {
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
      cell: ({ row }: { row: Row<TreatmentPlanWithRelations> }) => (
        <TreatmentPlanActions treatmentPlan={row.original} />
      ),
    },
  ]

  const table = useReactTable({
    data: treatmentPlans,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center h-32 text-destructive">
          Error al cargar planes de tratamiento: {error.message}
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
  if (treatmentPlans.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileText />
          </EmptyMedia>
          <EmptyTitle>No hay planes de tratamiento</EmptyTitle>
          <EmptyDescription>
            No se encontraron planes de tratamiento. Crea tu primer plan para
            comenzar.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  // Función para renderizar el contenido según la vista
  const renderContent = () => {
    const paginatedTreatmentPlans = table
      .getRowModel()
      .rows.map((row) => row.original)

    if (viewMode === 'cards') {
      return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginatedTreatmentPlans.map((treatmentPlan) => (
            <div
              key={treatmentPlan.id}
              className="rounded-lg border bg-card p-4 space-y-3"
            >
              {/* Header de la tarjeta */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-sm truncate">
                      {treatmentPlan.title}
                    </div>
                  </div>
                </div>
                <TreatmentPlanStatusBadge
                  status={treatmentPlan.status as any}
                />
              </div>

              {/* Contenido principal */}
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  <strong>Paciente:</strong>{' '}
                  {treatmentPlan.patients
                    ? `${treatmentPlan.patients.first_name} ${treatmentPlan.patients.last_name}`
                    : '-'}
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong>Responsable:</strong>{' '}
                  {treatmentPlan.staff
                    ? `${treatmentPlan.staff.first_name} ${treatmentPlan.staff.last_name}`
                    : '-'}
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong>Costo Total:</strong>{' '}
                  {formatCurrency(treatmentPlan.total || 0)}
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong>Creado:</strong>{' '}
                  {new Date(treatmentPlan.created_at).toLocaleDateString(
                    'es-ES'
                  )}
                </div>
              </div>

              {/* Footer de la tarjeta */}
              <div className="flex items-center justify-end pt-2">
                <TreatmentPlanActions treatmentPlan={treatmentPlan} />
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (viewMode === 'list') {
      return (
        <div className="space-y-3">
          {paginatedTreatmentPlans.map((treatmentPlan) => (
            <div
              key={treatmentPlan.id}
              className="flex items-center space-x-4 rounded-lg border bg-card p-4 hover:bg-muted/50 transition-colors"
            >
              {/* Icon */}
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-primary" />
              </div>

              {/* Contenido principal */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{treatmentPlan.title}</div>
                  <TreatmentPlanStatusBadge
                    status={treatmentPlan.status as any}
                  />
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>
                    {treatmentPlan.patients
                      ? `${treatmentPlan.patients.first_name} ${treatmentPlan.patients.last_name}`
                      : '-'}
                  </span>
                  <span>{formatCurrency(treatmentPlan.total || 0)}</span>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                <TreatmentPlanActions treatmentPlan={treatmentPlan} />
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
              .map((headerGroup: HeaderGroup<TreatmentPlanWithRelations>) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(
                    (header: Header<TreatmentPlanWithRelations, unknown>) => (
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
              table
                .getRowModel()
                .rows.map((row: Row<TreatmentPlanWithRelations>) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row
                      .getVisibleCells()
                      .map(
                        (cell: Cell<TreatmentPlanWithRelations, unknown>) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        )
                      )}
                  </TableRow>
                ))
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

      {/* Contenido */}
      {renderContent()}

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
            treatmentPlans.length
          )}{' '}
          de {treatmentPlans.length} planes de tratamiento
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
