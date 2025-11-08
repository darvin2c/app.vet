'use client'

import { Fragment } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ItemGroup,
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from '@/components/ui/item'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from '@/components/ui/empty'
import { useSearch } from '@/components/ui/search-input/use-search'
import { useOrderBy } from '@/components/ui/order-by/use-order-by'
import { FilterConfig, useFilters } from '@/components/ui/filters'
import { type ViewMode } from '@/components/ui/view-mode-toggle'
import { useBreedsList } from '@/hooks/breeds/use-breed-list'
import { BreedCreateButton } from './breed-create-button'
import { BreedImportButton } from './breed-import-button'
import { OrderByConfig } from '@/components/ui/order-by'
import { IsActiveDisplay } from '../ui/is-active-field'
import { BreedActions } from './breed-actions'
import { Tables } from '@/types/supabase.types'
import { ArrowUpRightIcon } from 'lucide-react'
import { Button } from '../ui/button'

type Breed = Tables<'breeds'> & {
  species: Tables<'species'> | null
}

interface BreedListProps {
  speciesId?: string
  filterConfig?: FilterConfig[]
  orderByConfig?: OrderByConfig
  viewMode?: ViewMode
}

export function BreedList({
  speciesId,
  filterConfig = [],
  orderByConfig,
  viewMode = 'table',
}: BreedListProps) {
  const { appliedFilters } = useFilters(filterConfig)
  const { appliedSorts } = useOrderBy(orderByConfig)
  const { appliedSearch } = useSearch()

  const {
    data: breeds = [],
    isLoading,
    error,
  } = useBreedsList({
    species_id: speciesId,
    filters: appliedFilters,
    search: appliedSearch,
    orders: appliedSorts,
  })

  const columns: ColumnDef<Breed>[] = [
    {
      accessorKey: 'name',
      header: 'Nombre',
      cell: ({ row }) => (
        <div>
          <span>{row.getValue('name')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Descripción',
      cell: ({ row }) => {
        const description = row.getValue('description') as string
        return description ? (
          <div className="truncate" title={description}>
            {description}
          </div>
        ) : (
          <span className="text-muted-foreground">Sin descripción</span>
        )
      },
    },
    {
      accessorKey: 'is_active',
      header: 'Estado',
      cell: ({ row }) => <IsActiveDisplay value={row.getValue('is_active')} />,
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => <BreedActions breed={row.original} />,
    },
  ]

  const table = useReactTable({
    data: breeds,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) {
    return <TableSkeleton />
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error al cargar las razas</p>
      </div>
    )
  }

  if (breeds.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No hay razas</EmptyTitle>
          <EmptyDescription>
            No se encontraron razas que coincidan con los filtros aplicados.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <BreedCreateButton selectedSpeciesId={speciesId}>
              Crear Raza
            </BreedCreateButton>
            <BreedImportButton selectedSpeciesId={speciesId}>
              Importar Razas
            </BreedImportButton>
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
    )
  }

  if (viewMode === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {breeds.map((breed) => (
          <Card key={breed.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{breed.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <IsActiveDisplay value={breed.is_active} />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {breed.description || 'Sin descripción'}
              </p>
            </CardHeader>

            <CardFooter>
              <BreedActions breed={breed} />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (viewMode === 'list') {
    return (
      <ItemGroup>
        {breeds.map((breed) => (
          <Item key={breed.id} className="hover:bg-muted/50">
            <ItemContent>
              <ItemTitle>{breed.name}</ItemTitle>
              <ItemDescription>
                {breed.description || 'Sin descripción'}
              </ItemDescription>
              <div className="flex items-center gap-4 mt-2">
                <IsActiveDisplay value={breed.is_active} />
              </div>
            </ItemContent>
            <ItemActions>
              <BreedActions breed={breed} />
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
    )
  }

  return (
    <div className="space-y-4">
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
              <Fragment key={row.id}>
                <TableRow
                  data-state={row.getIsSelected() && 'selected'}
                  className="hover:bg-muted/50"
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
              </Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No hay resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
