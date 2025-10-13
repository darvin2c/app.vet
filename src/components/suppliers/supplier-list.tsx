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
import { ChevronLeft, ChevronRight, Mail, Phone, Globe, MapPin } from 'lucide-react'
import { SupplierActions } from './supplier-actions'
import useSuppliers from '@/hooks/suppliers/use-supplier-list'
import { SupplierFilters } from '@/schemas/suppliers.schema'
import { Tables } from '@/types/supabase.types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

type Supplier = Tables<'suppliers'>

interface SupplierListProps {
  filters?: SupplierFilters
}

export function SupplierList({ filters }: SupplierListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('table')

  const { data: suppliers = [], isLoading } = useSuppliers(filters)

  const handleEdit = useCallback((supplier: Supplier) => {
    // Handle edit logic
    console.log('Edit supplier:', supplier)
  }, [])

  const handleDelete = useCallback((supplier: Supplier) => {
    // Handle delete logic
    console.log('Delete supplier:', supplier)
  }, [])

  const columns: ColumnDef<Supplier>[] = [
    {
      accessorKey: 'name',
      header: 'Nombre',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'contact_person',
      header: 'Contacto',
      cell: ({ row }) => {
        const contact = row.getValue('contact_person') as string
        return contact || '-'
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => {
        const email = row.getValue('email') as string
        return email ? (
          <a
            href={`mailto:${email}`}
            className="text-blue-600 hover:underline"
          >
            {email}
          </a>
        ) : (
          '-'
        )
      },
    },
    {
      accessorKey: 'phone',
      header: 'Teléfono',
      cell: ({ row }) => {
        const phone = row.getValue('phone') as string
        return phone ? (
          <a
            href={`tel:${phone}`}
            className="text-blue-600 hover:underline"
          >
            {phone}
          </a>
        ) : (
          '-'
        )
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Fecha de Registro',
      cell: ({ row }) => {
        const date = row.getValue('created_at') as string
        return format(new Date(date), 'dd/MM/yyyy', { locale: es })
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <SupplierActions supplier={row.original} />
      ),
    },
  ]

  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data: suppliers,
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
    (headerGroup: HeaderGroup<Supplier>) => (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map((header: Header<Supplier, unknown>) => (
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
    (row: Row<Supplier>) => (
      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
        {row.getVisibleCells().map((cell: Cell<Supplier, unknown>) => (
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
      {suppliers.map((supplier) => (
        <Card key={supplier.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-lg">{supplier.name}</CardTitle>
              </div>
              <SupplierActions supplier={supplier} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              {supplier.contact_person && (
                <div>
                  <span className="font-medium text-muted-foreground">
                    Contacto:
                  </span>
                  <p className="mt-1">{supplier.contact_person}</p>
                </div>
              )}

              {supplier.email && (
                <div>
                  <span className="font-medium text-muted-foreground">
                    Email:
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`mailto:${supplier.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {supplier.email}
                    </a>
                  </div>
                </div>
              )}

              {supplier.phone && (
                <div>
                  <span className="font-medium text-muted-foreground">
                    Teléfono:
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`tel:${supplier.phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {supplier.phone}
                    </a>
                  </div>
                </div>
              )}

              {supplier.address && (
                <div>
                  <span className="font-medium text-muted-foreground">
                    Dirección:
                  </span>
                  <div className="mt-1 flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p>{supplier.address}</p>
                    </div>
                  </div>
                </div>
              )}

              {supplier.website && (
                <div>
                  <span className="font-medium text-muted-foreground">
                    Sitio Web:
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={supplier.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {supplier.website}
                    </a>
                  </div>
                </div>
              )}

              {supplier.document_number && (
                <div>
                  <span className="font-medium text-muted-foreground">
                    Documento:
                  </span>
                  <p className="mt-1">{supplier.document_number}</p>
                </div>
              )}

              <div>
                <span className="font-medium text-muted-foreground">
                  Registrado:
                </span>
                <p className="mt-1">
                  {format(new Date(supplier.created_at), 'dd/MM/yyyy', {
                    locale: es,
                  })}
                </p>
              </div>
            </div>

            {supplier.notes && (
              <div className="mt-4 pt-4 border-t">
                <span className="font-medium text-muted-foreground">
                  Notas:
                </span>
                <p className="mt-1 text-sm">{supplier.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )

  // Función para renderizar vista de lista
  const renderListView = () => (
    <ItemGroup className="space-y-2">
      {suppliers.map((supplier) => (
        <Item key={supplier.id} variant="outline">
          <ItemContent>
            <ItemTitle>{supplier.name}</ItemTitle>
            <ItemDescription>
              {supplier.contact_person && `Contacto: ${supplier.contact_person}`}
              {supplier.email && ` • Email: ${supplier.email}`}
              {supplier.phone && ` • Tel: ${supplier.phone}`}
            </ItemDescription>
            <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
              {supplier.address && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {supplier.address}
                </span>
              )}
              <span>
                Registrado: {format(new Date(supplier.created_at), 'dd/MM/yyyy', { locale: es })}
              </span>
            </div>
          </ItemContent>
          <ItemActions>
            <SupplierActions supplier={supplier} />
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  )

  if (isLoading) {
    return <TableSkeleton variant={viewMode} />
  }

  if (!suppliers || suppliers.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No hay proveedores</EmptyTitle>
          <EmptyDescription>
            No se encontraron proveedores con los filtros aplicados.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controles de vista */}
      <div className="flex justify-end">
        <ViewModeToggle onValueChange={setViewMode} resource="suppliers" />
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
                suppliers.length
              )}{' '}
              de {suppliers.length} proveedores
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
