'use client'

import { useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
import { HospitalizationActions } from './hospitalization-actions'
import { useHospitalizations } from '@/hooks/hospitalizations/use-hospitalization-list'
import { Tables } from '@/types/supabase.types'
import { FilterConfig } from '@/types/filters.types'
import { OrderByConfig } from '@/components/ui/order-by'
import { useFilters } from '@/hooks/use-filters'
import { useOrderBy } from '@/components/ui/order-by/use-order-by'
import { useSearch } from '@/hooks/use-search'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar, Bed, DollarSign } from 'lucide-react'

// Tipo para hospitalization (sin pet_id por ahora, se agregará después)
type Hospitalization = Tables<'hospitalizations'>

interface HospitalizationListProps {
  petId?: string
  filterConfig?: FilterConfig[]
  orderByConfig?: OrderByConfig
}

export function HospitalizationList({
  petId,
  filterConfig = [],
  orderByConfig,
}: HospitalizationListProps) {
  const [view, setView] = useState('table')
  const { appliedFilters } = useFilters()
  const { appliedSorts } = useOrderBy()
  const { appliedSearch } = useSearch()

  const {
    data: hospitalizations = [],
    isLoading,
    error,
  } = useHospitalizations({
    petId,
    filters: appliedFilters,
    search: appliedSearch,
    orders: appliedSorts,
  })

  const columns: ColumnDef<Hospitalization>[] = [
    {
      accessorKey: 'admission_at',
      header: 'Fecha Ingreso',
      cell: ({ row }) => {
        const date = row.getValue('admission_at') as string
        return date ? (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            {format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: es })}
          </div>
        ) : (
          <span className="text-muted-foreground">Sin fecha</span>
        )
      },
    },
    {
      accessorKey: 'discharge_at',
      header: 'Fecha Alta',
      cell: ({ row }) => {
        const date = row.getValue('discharge_at') as string
        return date ? (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            {format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: es })}
          </div>
        ) : (
          <Badge variant="secondary">En curso</Badge>
        )
      },
    },
    {
      accessorKey: 'bed_id',
      header: 'Cama',
      cell: ({ row }) => {
        const bedId = row.getValue('bed_id') as string
        return bedId ? (
          <div className="flex items-center gap-2">
            <Bed className="h-4 w-4 text-muted-foreground" />
            {bedId}
          </div>
        ) : (
          <span className="text-muted-foreground">Sin asignar</span>
        )
      },
    },
    {
      accessorKey: 'daily_rate',
      header: 'Tarifa Diaria',
      cell: ({ row }) => {
        const rate = row.getValue('daily_rate') as number
        return rate ? (
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            S/ {rate.toFixed(2)}
          </div>
        ) : (
          <span className="text-muted-foreground">Sin tarifa</span>
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => {
        const dischargeAt = row.original.discharge_at
        return (
          <Badge variant={dischargeAt ? 'secondary' : 'default'}>
            {dischargeAt ? 'Finalizada' : 'En curso'}
          </Badge>
        )
      },
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <HospitalizationActions hospitalization={row.original} />
      ),
    },
  ]

  const table = useReactTable({
    data: hospitalizations,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) {
    return <TableSkeleton />
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">
          Error al cargar las hospitalizaciones
        </p>
      </div>
    )
  }

  if (hospitalizations.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No hay hospitalizaciones</EmptyTitle>
          <EmptyDescription>
            No se encontraron hospitalizaciones con los filtros aplicados.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (view === 'card') {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {hospitalizations.map((hospitalization) => (
          <Card key={hospitalization.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Hospitalización #{hospitalization.id.slice(-8)}
                </CardTitle>
                <HospitalizationActions hospitalization={hospitalization} />
              </div>
              <CardDescription>
                <Badge
                  variant={
                    hospitalization.discharge_at ? 'secondary' : 'default'
                  }
                >
                  {hospitalization.discharge_at ? 'Finalizada' : 'En curso'}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Ingreso:</span>
                {hospitalization.admission_at ? (
                  format(
                    new Date(hospitalization.admission_at),
                    'dd/MM/yyyy HH:mm',
                    { locale: es }
                  )
                ) : (
                  <span className="text-muted-foreground">Sin fecha</span>
                )}
              </div>

              {hospitalization.discharge_at && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Alta:</span>
                  {format(
                    new Date(hospitalization.discharge_at),
                    'dd/MM/yyyy HH:mm',
                    { locale: es }
                  )}
                </div>
              )}

              {hospitalization.bed_id && (
                <div className="flex items-center gap-2 text-sm">
                  <Bed className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Cama:</span>
                  {hospitalization.bed_id}
                </div>
              )}

              {hospitalization.daily_rate && (
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Tarifa:</span>
                  S/ {hospitalization.daily_rate.toFixed(2)} / día
                </div>
              )}

              {hospitalization.notes && (
                <p className="text-sm text-muted-foreground">
                  {hospitalization.notes}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant={view === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('table')}
          >
            Tabla
          </Button>
          <Button
            variant={view === 'card' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('card')}
          >
            Tarjetas
          </Button>
        </div>
      </div>

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
    </div>
  )
}
