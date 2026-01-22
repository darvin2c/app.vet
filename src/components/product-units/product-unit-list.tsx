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
import { Card, CardContent } from '@/components/ui/card'
import { Tables } from '@/types/supabase.types'
import { ProductUnitActions } from './product-unit-actions'
import { ProductUnitCreateButton } from './product-unit-create-button'
import { ProductUnitImportButton } from './product-unit-import-button'
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
import { AlertCircle, Scale } from 'lucide-react'
import useProductUnits from '@/hooks/product-units/use-product-unit-list'
import { useFilters, FilterConfig } from '@/components/ui/filters'
import { ViewModeToggle, ViewMode } from '@/components/ui/view-mode-toggle'
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
} from '@/components/ui/item'
import { Alert, AlertDescription } from '../ui/alert'
import { useSearch } from '../ui/search-input'
import { Pagination, usePagination } from '../ui/pagination'

type ProductUnit = Tables<'product_units'>

export function ProductUnitList({
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

  const { data, isPending, error } = useProductUnits({
    filters: appliedFilters,
    orders: orderByHook.appliedSorts,
    search: appliedSearch,
    pagination: appliedPagination,
  })
  const productUnits = data?.data || []

  const columns: ColumnDef<ProductUnit>[] = [
    {
      accessorKey: 'name',
      header: ({ header }) => (
        <OrderByTableHeader field="name" orderByHook={orderByHook}>
          Nombre
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<ProductUnit> }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'abbreviation',
      header: ({ header }) => (
        <OrderByTableHeader field="abbreviation" orderByHook={orderByHook}>
          Abreviación
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<ProductUnit> }) => (
        <div className="text-sm text-muted-foreground">
          {row.getValue('abbreviation') || '-'}
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
      cell: ({ row }: { row: Row<ProductUnit> }) => (
        <IsActiveDisplay value={row.getValue('is_active')} />
      ),
    },
    {
      id: 'actions',
      cell: ({ row }: { row: Row<ProductUnit> }) => (
        <ProductUnitActions unit={row.original} />
      ),
    },
  ]

  const table = useReactTable({
    data: productUnits,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  // Función para renderizar el encabezado de la tabla
  const renderTableHeader = useCallback(
    (headerGroup: HeaderGroup<ProductUnit>) => (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map((header: Header<ProductUnit, unknown>) => (
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
    (row: Row<ProductUnit>) => (
      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
        {row.getVisibleCells().map((cell: Cell<ProductUnit, unknown>) => (
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
      {productUnits.map((productUnit) => (
        <Card
          key={productUnit.id}
          className="hover:shadow-md transition-shadow"
        >
          <CardContent className="p-6 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{productUnit.name}</h3>
                {productUnit.abbreviation && (
                  <p className="text-sm text-muted-foreground">
                    {productUnit.abbreviation}
                  </p>
                )}
              </div>
              <ProductUnitActions unit={productUnit} />
            </div>

            <div className="flex justify-between items-center">
              <IsActiveDisplay value={productUnit.is_active} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  // Función para renderizar vista de lista
  const renderListView = () => (
    <ItemGroup className="space-y-2">
      {productUnits.map((productUnit) => (
        <Item key={productUnit.id} variant="outline">
          <ItemContent>
            <ItemTitle>{productUnit.name}</ItemTitle>
            {productUnit.abbreviation && (
              <ItemDescription>{productUnit.abbreviation}</ItemDescription>
            )}
            <div className="flex gap-4 text-sm text-muted-foreground mt-2">
              <IsActiveDisplay value={productUnit.is_active} />
            </div>
          </ItemContent>
          <ItemActions>
            <ProductUnitActions unit={productUnit} />
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
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error al cargar unidades de producto: {error.message}
        </AlertDescription>
      </Alert>
    )
  }

  if (productUnits.length === 0) {
    return (
      <div className="flex items-center justify-center text-muted-foreground h-[calc(100vh-100px)]">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Scale className="h-16 w-16" />
            </EmptyMedia>
            <EmptyTitle>No hay unidades de producto</EmptyTitle>
            <EmptyDescription>
              No se encontraron unidades de producto que coincidan con los
              filtros aplicados.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <ProductUnitCreateButton>Crear Unidad</ProductUnitCreateButton>
              <ProductUnitImportButton>Importar Unidad</ProductUnitImportButton>
            </div>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controles de vista */}
      <div className="flex justify-end">
        <ViewModeToggle onValueChange={setViewMode} resource="product-units" />
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
