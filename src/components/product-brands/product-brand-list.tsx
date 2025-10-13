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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ProductBrandActions } from './product-brand-actions'
import useProductBrands from '@/hooks/product-brands/use-product-brand-list'
import { ProductBrandFilters } from '@/schemas/product-brands.schema'
import { Tables } from '@/types/supabase.types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

type ProductBrand = Tables<'product_brands'>

interface ProductBrandListProps {
  filters?: ProductBrandFilters
}

export function ProductBrandList({ filters }: ProductBrandListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('table')

  const { data: productBrands = [], isLoading } = useProductBrands(filters)

  const handleEdit = useCallback((productBrand: ProductBrand) => {
    // Handle edit logic
    console.log('Edit product brand:', productBrand)
  }, [])

  const handleDelete = useCallback((productBrand: ProductBrand) => {
    // Handle delete logic
    console.log('Delete product brand:', productBrand)
  }, [])

  const columns: ColumnDef<ProductBrand>[] = [
    {
      accessorKey: 'name',
      header: 'Nombre',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Descripción',
      cell: ({ row }) => {
        const description = row.getValue('description') as string
        return description || '-'
      },
    },
    {
      accessorKey: 'is_active',
      header: 'Estado',
      cell: ({ row }) => {
        const isActive = row.getValue('is_active') as boolean
        return (
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? 'Activo' : 'Inactivo'}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Fecha de Creación',
      cell: ({ row }) => {
        const date = row.getValue('created_at') as string
        return format(new Date(date), 'dd/MM/yyyy', { locale: es })
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => <ProductBrandActions brand={row.original} />,
    },
  ]

  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: productBrands,
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
    (headerGroup: HeaderGroup<ProductBrand>) => (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map((header: Header<ProductBrand, unknown>) => (
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
    (row: Row<ProductBrand>) => (
      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
        {row.getVisibleCells().map((cell: Cell<ProductBrand, unknown>) => (
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
      {productBrands.map((brand) => (
        <Card key={brand.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-lg">{brand.name}</CardTitle>
                <Badge variant={brand.is_active ? 'default' : 'secondary'}>
                  {brand.is_active ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
              <ProductBrandActions brand={brand} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {brand.description && (
                <div>
                  <span className="font-medium text-muted-foreground">
                    Descripción:
                  </span>
                  <p className="mt-1">{brand.description}</p>
                </div>
              )}

              <div>
                <span className="font-medium text-muted-foreground">
                  Registrado:
                </span>
                <p className="mt-1">
                  {format(new Date(brand.created_at), 'dd/MM/yyyy', {
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
      {productBrands.map((brand) => (
        <Item key={brand.id} variant="outline">
          <ItemContent>
            <ItemTitle>{brand.name}</ItemTitle>
            <ItemDescription>
              {brand.description || 'Sin descripción'} • Registrado:{' '}
              {format(new Date(brand.created_at), 'dd/MM/yyyy', { locale: es })}
            </ItemDescription>
            <div className="flex gap-2 mt-2">
              <Badge variant={brand.is_active ? 'default' : 'secondary'}>
                {brand.is_active ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
          </ItemContent>
          <ItemActions>
            <ProductBrandActions brand={brand} />
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  )

  if (isLoading) {
    return <TableSkeleton variant={viewMode} />
  }

  if (!productBrands || productBrands.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No hay marcas de productos</EmptyTitle>
          <EmptyDescription>
            No se encontraron marcas de productos con los filtros aplicados.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controles de vista */}
      <div className="flex justify-end">
        <ViewModeToggle onValueChange={setViewMode} resource="product-brands" />
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
                productBrands.length
              )}{' '}
              de {productBrands.length} marcas
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
