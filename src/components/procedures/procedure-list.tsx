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
import { Database } from '@/types/supabase.types'
import { ProcedureActions } from './procedure-actions'
import { IsActiveDisplay } from '@/components/ui/is-active-field'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import { ProcedureFilters } from '@/schemas/procedures.schema'
import { ChevronLeft, ChevronRight, Stethoscope } from 'lucide-react'
import useProcedures from '@/hooks/procedures/use-procedures'

type Procedure = Database['public']['Tables']['procedures']['Row']

export function ProcedureList() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [filters, setFilters] = useState<ProcedureFilters>({})

  // Función para manejar cambios en los filtros
  const handleFiltersChange = useCallback((appliedFilters: any[]) => {
    const newFilters: ProcedureFilters = {}

    appliedFilters.forEach((filter) => {
      if (filter.field === 'search') {
        newFilters.search = filter.value
      } else if (filter.field === 'active') {
        newFilters.is_active = filter.value === 'true' || filter.value === true
      } else if (filter.field === 'has_price') {
        newFilters.has_price = filter.value === 'true' || filter.value === true
      } else if (filter.field === 'has_cdt_code') {
        newFilters.has_cdt_code =
          filter.value === 'true' || filter.value === true
      } else if (filter.field === 'has_snomed_code') {
        newFilters.has_snomed_code =
          filter.value === 'true' || filter.value === true
      } else if (filter.field === 'price_min') {
        newFilters.price_min = Number(filter.value)
      } else if (filter.field === 'price_max') {
        newFilters.price_max = Number(filter.value)
      } else if (filter.field === 'created_at' && filter.operator === 'gte') {
        newFilters.created_from = filter.value
      } else if (filter.field === 'created_at' && filter.operator === 'lte') {
        newFilters.created_to = filter.value
      }
    })

    setFilters(newFilters)
  }, [])

  // Usar el hook useProcedures con los filtros aplicados
  const { data: procedures = [], isLoading, error } = useProcedures(filters)

  const columns: ColumnDef<Procedure>[] = [
    {
      accessorKey: 'name',
      header: 'Nombre',
      cell: ({ row }: { row: Row<Procedure> }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'code',
      header: 'Código',
      cell: ({ row }: { row: Row<Procedure> }) => (
        <div className="font-mono text-sm bg-muted px-2 py-1 rounded">
          {row.getValue('code')}
        </div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Descripción',
      cell: ({ row }: { row: Row<Procedure> }) => {
        const description = row.getValue('description') as string
        return (
          <div className="text-sm text-muted-foreground max-w-xs truncate">
            {description || '-'}
          </div>
        )
      },
    },
    {
      accessorKey: 'base_price',
      header: 'Precio Base',
      cell: ({ row }: { row: Row<Procedure> }) => {
        const price = row.getValue('base_price') as number
        return price ? (
          <div className="text-sm font-medium">S/ {price.toFixed(2)}</div>
        ) : (
          <div className="text-sm text-muted-foreground">-</div>
        )
      },
    },
    {
      accessorKey: 'cdt_code',
      header: 'CDT',
      cell: ({ row }: { row: Row<Procedure> }) => {
        const cdtCode = row.getValue('cdt_code') as string
        return cdtCode ? (
          <div className="font-mono text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
            {cdtCode}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">-</div>
        )
      },
    },
    {
      accessorKey: 'snomed_code',
      header: 'SNOMED',
      cell: ({ row }: { row: Row<Procedure> }) => {
        const snomedCode = row.getValue('snomed_code') as string
        return snomedCode ? (
          <div className="font-mono text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
            {snomedCode}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">-</div>
        )
      },
    },
    {
      accessorKey: 'active',
      header: 'Estado',
      cell: ({ row }: { row: Row<Procedure> }) => {
        const isActive = row.getValue('active') as boolean
        return <IsActiveDisplay value={isActive} />
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Fecha de Registro',
      cell: ({ row }: { row: Row<Procedure> }) => {
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
      cell: ({ row }: { row: Row<Procedure> }) => (
        <ProcedureActions procedure={row.original} />
      ),
    },
  ]

  const table = useReactTable({
    data: procedures,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center h-32 text-destructive">
          Error al cargar procedimientos: {error.message}
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <TableSkeleton variant="table" rows={5} columns={9} showHeader={true} />
    )
  }

  return (
    <div className="space-y-4">
      {/* Tabla */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table
              .getHeaderGroups()
              .map((headerGroup: HeaderGroup<Procedure>) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(
                    (header: Header<Procedure, unknown>) => (
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
              table.getRowModel().rows.map((row: Row<Procedure>) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row
                    .getVisibleCells()
                    .map((cell: Cell<Procedure, unknown>) => (
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
                        <Stethoscope />
                      </EmptyMedia>
                      <EmptyTitle>No hay procedimientos</EmptyTitle>
                      <EmptyDescription>
                        No se encontraron procedimientos. Crea tu primer
                        procedimiento para comenzar.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Mostrando {table.getRowModel().rows.length} de {procedures.length}{' '}
          procedimiento(s)
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
