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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
import useSupplierBrands from '@/hooks/supplier-brands/use-supplier-brand-list'
import { SupplierBrandFilters } from '@/schemas/supplier-brands.schema'
import { SupplierBrandActions } from './supplier-brand-actions'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Tables } from '@/types/supabase.types'

type SupplierBrand = Tables<'supplier_brands'> & {
  suppliers?: {
    id: string
    name: string
    contact_person: string | null
    email: string | null
    is_active: boolean
  }
  product_brands?: {
    id: string
    name: string
    description: string | null
    is_active: boolean
  }
}

interface SupplierBrandListProps {
  filters?: SupplierBrandFilters
}

export function SupplierBrandList({ filters }: SupplierBrandListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [sorting, setSorting] = useState<SortingState>([])

  const { data: supplierBrands = [], isLoading } = useSupplierBrands(filters)

  const columns: ColumnDef<SupplierBrand>[] = [
    {
      accessorKey: 'suppliers.name',
      header: 'Proveedor',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.suppliers?.name}</div>
      ),
    },
    {
      accessorKey: 'suppliers.contact_person',
      header: 'Contacto',
      cell: ({ row }) => {
        const contact = row.original.suppliers?.contact_person
        return contact || '-'
      },
    },
    {
      accessorKey: 'product_brands.name',
      header: 'Marca',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.product_brands?.name}</div>
      ),
    },
    {
      accessorKey: 'suppliers.is_active',
      header: 'Estado Proveedor',
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.suppliers?.is_active ? 'default' : 'secondary'
          }
        >
          {row.original.suppliers?.is_active ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    {
      accessorKey: 'product_brands.is_active',
      header: 'Estado Marca',
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.product_brands?.is_active ? 'default' : 'secondary'
          }
        >
          {row.original.product_brands?.is_active ? 'Activa' : 'Inactiva'}
        </Badge>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Fecha Asignación',
      cell: ({ row }) => (
        <div>
          {format(new Date(row.getValue('created_at')), 'dd/MM/yyyy', {
            locale: es,
          })}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <SupplierBrandActions
          supplierId={row.original.supplier_id}
          brandId={row.original.brand_id}
        />
      ),
    },
  ]

  const table = useReactTable({
    data: supplierBrands,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  const renderTableHeader = useCallback(
    (headerGroup: HeaderGroup<SupplierBrand>) => (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map((header: Header<SupplierBrand, unknown>) => (
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

  const renderTableRow = useCallback((row: Row<SupplierBrand>) => (
    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
      {row.getVisibleCells().map((cell: Cell<SupplierBrand, unknown>) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  ), [])

  const renderTableView = useCallback(() => (
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
  ), [table, columns.length, renderTableHeader, renderTableRow])

  const renderCardsView = useCallback(() => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {supplierBrands.map((supplierBrand) => (
        <Card key={`${supplierBrand.supplier_id}-${supplierBrand.brand_id}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Asignación de Marca
            </CardTitle>
            <SupplierBrandActions
              supplierId={supplierBrand.supplier_id}
              brandId={supplierBrand.brand_id}
            />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Proveedor
                </p>
                <p className="text-sm">{supplierBrand.suppliers?.name}</p>
                {supplierBrand.suppliers?.contact_person && (
                  <p className="text-xs text-muted-foreground">
                    Contacto: {supplierBrand.suppliers.contact_person}
                  </p>
                )}
                <Badge
                  variant={
                    supplierBrand.suppliers?.is_active ? 'default' : 'secondary'
                  }
                >
                  {supplierBrand.suppliers?.is_active ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Marca
                </p>
                <p className="text-sm">{supplierBrand.product_brands?.name}</p>
                {supplierBrand.product_brands?.description && (
                  <p className="text-xs text-muted-foreground">
                    {supplierBrand.product_brands.description}
                  </p>
                )}
                <Badge
                  variant={
                    supplierBrand.product_brands?.is_active
                      ? 'default'
                      : 'secondary'
                  }
                >
                  {supplierBrand.product_brands?.is_active
                    ? 'Activa'
                    : 'Inactiva'}
                </Badge>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Asignado el{' '}
                  {format(new Date(supplierBrand.created_at), 'dd/MM/yyyy', {
                    locale: es,
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  ), [supplierBrands])

  const renderListView = useCallback(() => (
    <ItemGroup>
      {supplierBrands.map((supplierBrand) => (
        <Item key={`${supplierBrand.supplier_id}-${supplierBrand.brand_id}`}>
          <ItemContent>
            <ItemTitle>
              {supplierBrand.suppliers?.name} - {supplierBrand.product_brands?.name}
            </ItemTitle>
            <ItemDescription>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs">Proveedor:</span>
                  <Badge
                    variant={
                      supplierBrand.suppliers?.is_active ? 'default' : 'secondary'
                    }
                  >
                    {supplierBrand.suppliers?.is_active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs">Marca:</span>
                  <Badge
                    variant={
                      supplierBrand.product_brands?.is_active
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {supplierBrand.product_brands?.is_active
                      ? 'Activa'
                      : 'Inactiva'}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Asignado el{' '}
                  {format(new Date(supplierBrand.created_at), 'dd/MM/yyyy', {
                    locale: es,
                  })}
                </div>
              </div>
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <SupplierBrandActions
              supplierId={supplierBrand.supplier_id}
              brandId={supplierBrand.brand_id}
            />
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  ), [supplierBrands])

  if (isLoading) {
    return <TableSkeleton variant={viewMode} />
  }

  if (!supplierBrands || supplierBrands.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No hay asignaciones de marcas</EmptyTitle>
          <EmptyDescription>
            No se encontraron asignaciones de marcas a proveedores con los
            filtros aplicados.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controles de vista */}
      <div className="flex justify-end">
        <ViewModeToggle onValueChange={setViewMode} resource="supplier-brands" />
      </div>

      {/* Contenido según la vista seleccionada */}
      {viewMode === 'table' && renderTableView()}
      {viewMode === 'cards' && renderCardsView()}
      {viewMode === 'list' && renderListView()}

      {/* Paginación */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{' '}
          {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Filas por página</p>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value))
              }}
              className="h-8 w-[70px] rounded border border-input bg-background px-3 py-1 text-sm"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Página {table.getState().pagination.pageIndex + 1} de{' '}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Ir a la página anterior</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Ir a la página siguiente</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
