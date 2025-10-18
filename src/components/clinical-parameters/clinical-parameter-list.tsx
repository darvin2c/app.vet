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
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tables } from '@/types/supabase.types'
import { ClinicalParameterActions } from './clinical-parameter-actions'
import { ClinicalParameterCreateButton } from './clinical-parameter-create-button'
import { OrderByTableHeader } from '@/components/ui/order-by'
import { useOrderBy } from '@/hooks/use-order-by'
import { OrderByConfig } from '@/types/order-by.types'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from '@/components/ui/empty'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import {
  ArrowUpRightIcon,
  ChevronLeft,
  ChevronRight,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react'
import { useClinicalParameterList } from '@/hooks/clinical-parameters/use-clinical-parameter-list'
import { useFilters } from '@/hooks/use-filters'
import { FilterConfig } from '@/types/filters.types'
import { useSearch } from '@/hooks/use-search'
import { ViewModeToggle, ViewMode } from '@/components/ui/view-mode-toggle'
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
} from '@/components/ui/item'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

type ClinicalParameter = Tables<'clinical_parameters'>

interface ClinicalParameterListProps {
  filterConfig: FilterConfig[]
  orderByConfig: OrderByConfig
  petId?: string
}

export function ClinicalParameterList({
  filterConfig,
  orderByConfig,
  petId,
}: ClinicalParameterListProps) {
  // Estado para el modo de vista
  const [viewMode, setViewMode] = useState<ViewMode>('table')

  // Hooks para filtros, búsqueda y ordenamiento
  const { appliedFilters } = useFilters(filterConfig)
  const orderByHook = useOrderBy(orderByConfig)
  const { appliedSearch } = useSearch()

  const {
    data: clinicalParameters = [],
    isPending,
    error,
  } = useClinicalParameterList({
    petId,
    filters: appliedFilters,
    search: appliedSearch,
    orders: orderByHook.appliedSorts,
  })

  // Función para obtener valor de parámetro
  const getParameterValue = (params: any, key: string) => {
    try {
      if (typeof params === 'string') {
        const parsed = JSON.parse(params)
        return parsed[key]
      }
      return params?.[key]
    } catch {
      return null
    }
  }

  // Función para obtener estado del parámetro
  const getParameterStatus = (
    value: number,
    normal: { min: number; max: number }
  ) => {
    if (value < normal.min)
      return { variant: 'destructive' as const, text: 'Bajo' }
    if (value > normal.max)
      return { variant: 'destructive' as const, text: 'Alto' }
    return { variant: 'secondary' as const, text: 'Normal' }
  }

  // Rangos normales típicos para mascotas
  const normalRanges = {
    temperature: { min: 38, max: 39.5, unit: '°C' },
    heart_rate: { min: 60, max: 140, unit: 'bpm' },
    respiratory_rate: { min: 10, max: 30, unit: 'rpm' },
    weight: { min: 0, max: 100, unit: 'kg' },
    blood_pressure_systolic: { min: 110, max: 160, unit: 'mmHg' },
    blood_pressure_diastolic: { min: 60, max: 100, unit: 'mmHg' },
  }

  // Función para formatear fecha de forma segura
  const formatSafeDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'Sin fecha'

    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'Sin fecha'
      }
      return format(date, 'dd/MM/yyyy HH:mm', { locale: es })
    } catch (error) {
      return 'Sin fecha'
    }
  }

  // Función para renderizar parámetros principales
  const renderMainParameters = (params: any) => {
    const mainParams = ['temperature', 'heart_rate', 'respiratory_rate', 'weight']
    const values = []

    for (const param of mainParams) {
      const value = getParameterValue(params, param)
      if (value !== null && value !== undefined) {
        const range = normalRanges[param as keyof typeof normalRanges]
        const status = getParameterStatus(parseFloat(value), range)
        values.push(
          <Badge key={param} variant={status.variant} className="text-xs">
            {param === 'temperature' && 'Temp: '}
            {param === 'heart_rate' && 'FC: '}
            {param === 'respiratory_rate' && 'FR: '}
            {param === 'weight' && 'Peso: '}
            {value} {range.unit}
          </Badge>
        )
      }
    }

    return values.length > 0 ? values : <span className="text-muted-foreground">-</span>
  }

  const columns: ColumnDef<ClinicalParameter>[] = [
    {
      accessorKey: 'measured_at',
      header: ({ header }) => (
        <OrderByTableHeader field="measured_at" orderByHook={orderByHook}>
          Fecha de Medición
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<ClinicalParameter> }) => (
        <div className="font-medium">
          {formatSafeDate(row.getValue('measured_at'))}
        </div>
      ),
    },
    {
      accessorKey: 'params',
      header: 'Parámetros Principales',
      cell: ({ row }: { row: Row<ClinicalParameter> }) => (
        <div className="flex flex-wrap gap-1">
          {renderMainParameters(row.getValue('params'))}
        </div>
      ),
    },
    {
      accessorKey: 'schema_version',
      header: ({ header }) => (
        <OrderByTableHeader field="schema_version" orderByHook={orderByHook}>
          Versión
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<ClinicalParameter> }) => (
        <div className="text-sm text-muted-foreground">
          v{row.getValue('schema_version') || '1'}
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }: { row: Row<ClinicalParameter> }) => (
        <ClinicalParameterActions clinicalParameter={row.original} />
      ),
    },
  ]

  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: clinicalParameters,
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
    (headerGroup: HeaderGroup<ClinicalParameter>) => (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map((header: Header<ClinicalParameter, unknown>) => (
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
    (row: Row<ClinicalParameter>) => (
      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
        {row.getVisibleCells().map((cell: Cell<ClinicalParameter, unknown>) => (
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
      {clinicalParameters.map((parameter) => (
        <Card key={parameter.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">
                  {formatSafeDate(parameter.measured_at)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Versión: v{parameter.schema_version || '1'}
                </p>
              </div>
              <ClinicalParameterActions clinicalParameter={parameter} />
            </div>

            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-muted-foreground">Parámetros:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {renderMainParameters(parameter.params)}
                </div>
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
      {clinicalParameters.map((parameter) => (
        <Item key={parameter.id} variant="outline">
          <ItemContent>
            <ItemTitle>{formatSafeDate(parameter.measured_at)}</ItemTitle>
            <ItemDescription>
              Versión: v{parameter.schema_version || '1'}
            </ItemDescription>
            <div className="flex flex-wrap gap-1 mt-2">
              {renderMainParameters(parameter.params)}
            </div>
          </ItemContent>
          <ItemActions>
            <ClinicalParameterActions clinicalParameter={parameter} />
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  )

  // Estados de carga y error
  if (isPending) {
    return <TableSkeleton variant={viewMode} />
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">
          Error al cargar parámetros clínicos: {error.message}
        </p>
      </div>
    )
  }

  if (clinicalParameters.length === 0) {
    return (
      <div className="flex items-center justify-center text-muted-foreground h-[calc(100vh-100px)]">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Activity className="h-16 w-16" />
            </EmptyMedia>
            <EmptyTitle>No hay parámetros clínicos</EmptyTitle>
            <EmptyDescription>
              No se encontraron parámetros clínicos que coincidan con los filtros
              aplicados.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              {petId && <ClinicalParameterCreateButton petId={petId} />}
              <Button variant="outline">Importar Parámetros</Button>
            </div>
          </EmptyContent>
          <Button
            variant="link"
            asChild
            className="text-muted-foreground"
            size="sm"
          >
            <a href="#">
              Saber Más <ArrowUpRightIcon />
            </a>
          </Button>
        </Empty>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controles de vista */}
      <div className="flex justify-end">
        <ViewModeToggle onValueChange={setViewMode} resource="clinical-parameters" />
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
                clinicalParameters.length
              )}{' '}
              de {clinicalParameters.length} parámetros
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