'use client'

import { useState, useCallback } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
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
import { Database } from '@/types/supabase.types'
import { SpecialtyActions } from './specialty-actions'
import { SpecialtyCreateButton } from './specialty-create-button'
import { IsActiveDisplay } from '@/components/ui/is-active-field'
import { OrderByTableHeader } from '@/components/ui/order-by'
import { useOrderBy } from '@/components/ui/order-by'
import { OrderByConfig } from '@/components/ui/order-by'
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
  AlertCircle,
  ArrowUpRightIcon,
  Stethoscope,
} from 'lucide-react'
import { useSpecialtyList } from '@/hooks/specialties/use-specialty-list'
import { useFilters, FilterConfig } from '@/components/ui/filters'
import { useSearch } from '@/components/ui/search-input/use-search'
import { ViewModeToggle, ViewMode } from '@/components/ui/view-mode-toggle'
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
} from '@/components/ui/item'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { SpecialtyImportButton } from './specialty-import-button'
import { Pagination, usePagination } from '../ui/pagination'

type Specialty = Database['public']['Tables']['specialties']['Row']

export function SpecialtyList({
  filterConfig,
  orderByConfig,
}: {
  filterConfig: FilterConfig[]
  orderByConfig: OrderByConfig
}) {
  // Estado para el modo de vista - inicializado con valor por defecto para evitar hydration mismatch
  const [viewMode, setViewMode] = useState<ViewMode>('table')

  // Usar el hook useFilters para obtener los filtros aplicados
  const { appliedFilters } = useFilters(filterConfig)
  const orderByHook = useOrderBy(orderByConfig)
  const { appliedSearch } = useSearch()
  const { appliedPagination, paginationProps } = usePagination()

  const { data, isPending, error } = useSpecialtyList({
    filters: appliedFilters,
    search: appliedSearch,
    orders: orderByHook.appliedSorts,
    pagination: appliedPagination,
  })
  const specialties = data?.data || []

  const columns: ColumnDef<Specialty>[] = [
    {
      accessorKey: 'name',
      header: ({ header }) => (
        <OrderByTableHeader field="name" orderByHook={orderByHook}>
          Nombre
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Specialty> }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'description',
      header: ({ header }) => (
        <OrderByTableHeader field="description" orderByHook={orderByHook}>
          Descripción
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Specialty> }) => (
        <div className="text-sm text-muted-foreground">
          {row.getValue('description') || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'is_active',
      header: ({ header }) => (
        <OrderByTableHeader field="is_active" orderByHook={orderByHook}>
          Estado
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Specialty> }) => (
        <IsActiveDisplay value={row.getValue('is_active')} />
      ),
    },
    {
      id: 'actions',
      cell: ({ row }: { row: Row<Specialty> }) => (
        <SpecialtyActions specialty={row.original} />
      ),
    },
  ]

  const table = useReactTable({
    data: specialties,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  // Función para renderizar el encabezado de la tabla
  const renderTableHeader = useCallback(
    (headerGroup: HeaderGroup<Specialty>) => (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map((header: Header<Specialty, unknown>) => (
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
    (row: Row<Specialty>) => (
      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
        {row.getVisibleCells().map((cell: Cell<Specialty, unknown>) => (
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
      {specialties.map((specialty) => (
        <Card key={specialty.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{specialty.name}</h3>
                {specialty.description && (
                  <p className="text-sm text-muted-foreground">
                    {specialty.description}
                  </p>
                )}
              </div>
              <SpecialtyActions specialty={specialty} />
            </div>

            <div className="flex justify-between items-center">
              <IsActiveDisplay value={specialty.is_active} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  // Función para renderizar vista de lista
  const renderListView = () => (
    <ItemGroup className="space-y-2">
      {specialties.map((specialty) => (
        <Item key={specialty.id} variant="outline">
          <ItemContent>
            <ItemTitle>{specialty.name}</ItemTitle>
            {specialty.description && (
              <ItemDescription>{specialty.description}</ItemDescription>
            )}
            <div className="flex gap-4 text-sm text-muted-foreground mt-2">
              <IsActiveDisplay value={specialty.is_active} />
            </div>
          </ItemContent>
          <ItemActions>
            <SpecialtyActions specialty={specialty} />
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  )

  // Estados de carga y error
  if (isPending) {
    // Durante la carga inicial, usar 'table' para evitar hydration mismatch
    // Después de la hidratación, usar el viewMode del usuario
    return <TableSkeleton variant={viewMode} />
  }

  if (error) {
    return (
      <Alert className="text-center py-8">
        <AlertCircle />
        <AlertTitle>Error al cargar especialidades</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )
  }

  if (specialties.length === 0) {
    return (
      <div className="flex items-center justify-center text-muted-foreground h-[calc(100vh-100px)]">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Stethoscope className="h-16 w-16" />
            </EmptyMedia>
            <EmptyTitle>No hay especialidades</EmptyTitle>
            <EmptyDescription>
              No se encontraron especialidades que coincidan con los filtros
              aplicados.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <SpecialtyCreateButton>Crear Especialidad</SpecialtyCreateButton>
              <SpecialtyImportButton isResponsive={false}>
                Importar Especialidad
              </SpecialtyImportButton>
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
        <ViewModeToggle onValueChange={setViewMode} resource="specialties" />
      </div>

      {/* Contenido según la vista seleccionada */}
      {viewMode === 'table' && (
        <>
          <div>
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
        </>
      )}

      {viewMode === 'cards' && renderCardsView()}
      {viewMode === 'list' && renderListView()}
      <div>
        <Pagination {...paginationProps} totalItems={data.total} />
      </div>
    </div>
  )
}
