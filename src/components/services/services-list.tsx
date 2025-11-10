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
import { ServiceActions } from './service-actions'
import { Database } from '@/types/supabase.types'
import { ServiceCreateButton } from './service-create-button'
import { ServiceImportButton } from './service-import-button'
import {
  useOrderBy,
  OrderByConfig,
  OrderByTableHeader,
} from '@/components/ui/order-by'
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
  Wrench,
} from 'lucide-react'
import useProductList from '@/hooks/products/use-products-list'
import {
  useFilters,
  FilterConfig,
  AppliedFilter,
} from '@/components/ui/filters'
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { IsActiveDisplay } from '@/components/ui/is-active-field'
import { Pagination, usePagination } from '../ui/pagination'

type Service = Database['public']['Tables']['products']['Row']

export function ServicesList({
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

  // fuerza filtro is_service=true
  const serviceFilters: AppliedFilter[] = [
    ...appliedFilters,
    { field: 'is_service', operator: 'eq', value: true },
  ]

  const { data, isLoading, error } = useProductList({
    filters: serviceFilters,
    search: appliedSearch,
    orders: orderByHook.appliedSorts,
    pagination: appliedPagination,
  })
  const services = data?.data || []

  const columns: ColumnDef<Service>[] = [
    {
      accessorKey: 'name',
      header: ({ header }) => (
        <OrderByTableHeader field="name" orderByHook={orderByHook}>
          Nombre
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Service> }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'sku',
      header: ({ header }) => (
        <OrderByTableHeader field="sku" orderByHook={orderByHook}>
          SKU
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Service> }) => (
        <div className="text-sm text-muted-foreground">
          {row.getValue('sku') || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'category_id',
      header: ({ header }) => (
        <OrderByTableHeader field="category_id" orderByHook={orderByHook}>
          Categoría
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Service> }) => (
        <div className="text-sm text-muted-foreground">
          {row.getValue('category_id') || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'unit_id',
      header: ({ header }) => (
        <OrderByTableHeader field="unit_id" orderByHook={orderByHook}>
          Unidad
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Service> }) => (
        <div className="text-sm text-muted-foreground">
          {row.getValue('unit_id') || '-'}
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
      cell: ({ row }: { row: Row<Service> }) => (
        <IsActiveDisplay value={row.getValue('is_active')} />
      ),
    },
    {
      id: 'actions',
      cell: ({ row }: { row: Row<Service> }) => (
        <ServiceActions service={row.original} />
      ),
    },
  ]

  const table = useReactTable({
    data: services,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  // Función para renderizar el encabezado de la tabla
  const renderTableHeader = useCallback(
    (headerGroup: HeaderGroup<Service>) => (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map((header: Header<Service, unknown>) => (
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
    (row: Row<Service>) => (
      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
        {row.getVisibleCells().map((cell: Cell<Service, unknown>) => (
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
      {services?.map((service) => (
        <Card key={service.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{service.name}</h3>
                {service.sku && (
                  <p className="text-sm text-muted-foreground">
                    SKU: {service.sku}
                  </p>
                )}
              </div>
              <ServiceActions service={service} />
            </div>

            <div className="space-y-2">
              {service.category_id && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Categoría:</span>{' '}
                  {service.category_id}
                </div>
              )}
              {service.unit_id && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Unidad:</span>{' '}
                  {service.unit_id}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <IsActiveDisplay value={service.is_active} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  // Función para renderizar vista de lista
  const renderListView = () => (
    <ItemGroup className="space-y-2">
      {services.map((service) => (
        <Item key={service.id} variant="outline">
          <ItemContent>
            <ItemTitle>{service.name}</ItemTitle>
            {service.sku && (
              <ItemDescription>SKU: {service.sku}</ItemDescription>
            )}
            <div className="flex gap-4 text-sm text-muted-foreground mt-2">
              {service.category_id && (
                <span>Categoría: {service.category_id}</span>
              )}
              {service.unit_id && <span>Unidad: {service.unit_id}</span>}
              <IsActiveDisplay value={service.is_active} />
            </div>
          </ItemContent>
          <ItemActions>
            <ServiceActions service={service} />
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  )

  // Estados de carga y error
  if (isLoading) {
    // Durante la carga inicial, usar 'table' para evitar hydration mismatch
    // Después de la hidratación, usar el viewMode del usuario
    return <TableSkeleton variant={viewMode} />
  }

  if (error) {
    return (
      <Alert>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Error al cargar servicios: {error.message}
        </AlertDescription>
      </Alert>
    )
  }

  if (services.length === 0) {
    return (
      <div className="flex items-center justify-center text-muted-foreground h-[calc(100vh-100px)]">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Wrench className="h-16 w-16" />
            </EmptyMedia>
            <EmptyTitle>No hay servicios</EmptyTitle>
            <EmptyDescription>
              No se encontraron servicios que coincidan con los filtros
              aplicados.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <ServiceCreateButton>Crear Servicio</ServiceCreateButton>
              <ServiceImportButton variant="outline">
                Importar Servicio
              </ServiceImportButton>
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
        <ViewModeToggle onValueChange={setViewMode} resource="services" />
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
        <Pagination {...paginationProps} totalItems={data?.total} />
      </div>
    </div>
  )
}
