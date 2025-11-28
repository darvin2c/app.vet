'use client'

import { useState, useCallback, Fragment } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
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
import { SpeciesActions } from './species-actions'
import { SpeciesCreateButton } from './species-create-button'
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
  ChevronRight,
  ChevronDown,
  Stethoscope,
} from 'lucide-react'
import { useSpeciesList } from '@/hooks/species/use-species-list'
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
import { BreedList } from '../breeds/breed-list'
import { useSearch } from '../ui/search-input'
import { Pagination, usePagination } from '../ui/pagination'

type Species = Database['public']['Tables']['species']['Row']

export function SpeciesList({
  filterConfig,
  orderByConfig,
}: {
  filterConfig: FilterConfig[]
  orderByConfig: OrderByConfig
}) {
  // Estado para el modo de vista - inicializado con valor por defecto para evitar hydration mismatch
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  // Estado para expansión en tarjetas y lista
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Usar el hook useFilters para obtener los filtros aplicados
  const { appliedFilters } = useFilters(filterConfig)
  const orderByHook = useOrderBy(orderByConfig)
  const { appliedSearch } = useSearch()
  const { appliedPagination, paginationProps } = usePagination()
  const { data, isPending, error } = useSpeciesList({
    filters: appliedFilters,
    search: appliedSearch,
    orders: orderByHook.appliedSorts,
    pagination: appliedPagination,
  })
  const species = data?.data || []

  const columns: ColumnDef<Species>[] = [
    {
      id: 'expander',
      header: () => null,
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-6 w-6"
          onClick={row.getToggleExpandedHandler()}
        >
          {row.getIsExpanded() ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      ),
    },
    {
      accessorKey: 'name',
      header: ({ header }) => (
        <OrderByTableHeader field="name" orderByHook={orderByHook}>
          Nombre
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Species> }) => (
        <div>{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'description',
      header: ({ header }) => (
        <OrderByTableHeader field="description" orderByHook={orderByHook}>
          Descripción
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<Species> }) => (
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
      cell: ({ row }: { row: Row<Species> }) => (
        <IsActiveDisplay value={row.getValue('is_active')} />
      ),
    },
    {
      id: 'actions',
      cell: ({ row }: { row: Row<Species> }) => (
        <SpeciesActions species={row.original} />
      ),
    },
  ]

  const table = useReactTable({
    data: species,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
  })

  // Función para renderizar el encabezado de la tabla
  const renderTableHeader = useCallback(
    (headerGroup: HeaderGroup<Species>) => (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map((header: Header<Species, unknown>) => (
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
    (row: Row<Species>) => (
      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
        {row.getVisibleCells().map((cell: Cell<Species, unknown>) => (
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
      {species.map((speciesItem) => (
        <Card
          key={speciesItem.id}
          className="hover:shadow-md transition-shadow"
        >
          <CardContent className="p-6 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{speciesItem.name}</h3>
                {speciesItem.description && (
                  <p className="text-sm text-muted-foreground">
                    {speciesItem.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpand(speciesItem.id)}
                >
                  {expandedIds.has(speciesItem.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
                <SpeciesActions species={speciesItem} />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <IsActiveDisplay value={speciesItem.is_active} />
            </div>
          </CardContent>
          {expandedIds.has(speciesItem.id) && (
            <div className="px-6 pb-6">
              <BreedList speciesId={speciesItem.id} viewMode={viewMode} />
            </div>
          )}
        </Card>
      ))}
    </div>
  )

  // Función para renderizar vista de lista
  const renderListView = () => (
    <ItemGroup className="space-y-2">
      {species.map((speciesItem) => (
        <Fragment key={speciesItem.id}>
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>{speciesItem.name}</ItemTitle>
              {speciesItem.description && (
                <ItemDescription>{speciesItem.description}</ItemDescription>
              )}
              <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                <IsActiveDisplay value={speciesItem.is_active} />
              </div>
            </ItemContent>
            <ItemActions>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleExpand(speciesItem.id)}
              >
                {expandedIds.has(speciesItem.id) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
              <SpeciesActions species={speciesItem} />
            </ItemActions>
          </Item>
          {expandedIds.has(speciesItem.id) && (
            <div className="pl-8">
              <BreedList speciesId={speciesItem.id} viewMode={viewMode} />
            </div>
          )}
        </Fragment>
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
          Error al cargar especies: {error.message}
        </AlertDescription>
      </Alert>
    )
  }

  if (species.length === 0) {
    return (
      <div className="flex items-center justify-center text-muted-foreground h-[calc(100vh-100px)]">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Stethoscope className="h-16 w-16" />
            </EmptyMedia>
            <EmptyTitle>No hay especies</EmptyTitle>
            <EmptyDescription>
              No se encontraron especies que coincidan con los filtros
              aplicados.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <SpeciesCreateButton>Crear Especie</SpeciesCreateButton>
              <Button variant="outline">Importar Especie</Button>
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
        <ViewModeToggle onValueChange={setViewMode} resource="species" />
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
                  table.getRowModel().rows.map((row) => (
                    <Fragment key={row.id}>
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                      >
                        {row
                          .getVisibleCells()
                          .map((cell: Cell<Species, unknown>) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                      </TableRow>
                      {row.getIsExpanded() && (
                        <TableRow>
                          <TableCell
                            colSpan={columns.length}
                            className="p-0 border-0"
                          >
                            <BreedList
                              speciesId={row.original.id}
                              viewMode={viewMode}
                            />
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
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
        </>
      )}

      {/*viewMode === 'cards' && renderCardsView()*/}
      {(viewMode === 'list' || viewMode === 'cards') && renderListView()}
      <Pagination {...paginationProps} totalItems={data?.total} />
    </div>
  )
}
