'use client'

import { useState, Fragment } from 'react'
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
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ItemGroup,
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemMedia,
} from '@/components/ui/item'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
import { ViewModeToggle, type ViewMode } from '@/components/ui/view-mode-toggle'
import { BreedActions } from './breed-actions'
import { useBreedsList } from '@/hooks/breeds/use-breed-list'
import { Tables } from '@/types/supabase.types'
import { FilterConfig, useFilters } from '@/components/ui/filters'
import { OrderByConfig } from '@/components/ui/order-by'
import { useOrderBy } from '@/components/ui/order-by/use-order-by'
import { useSearch } from '@/hooks/use-search'
import { format } from 'date-fns'
import { ChevronRight, ChevronDown, Dog, Calendar, Info } from 'lucide-react'

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
        <div className="flex items-center gap-2">
          <Dog className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.getValue('name')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'species',
      header: 'Especie',
      cell: ({ row }) => {
        const species = row.original.species
        return species ? (
          <Badge variant="secondary">{species.name}</Badge>
        ) : (
          <span className="text-muted-foreground">Sin especie</span>
        )
      },
    },
    {
      accessorKey: 'description',
      header: 'Descripción',
      cell: ({ row }) => {
        const description = row.getValue('description') as string
        return description ? (
          <div className="max-w-[200px] truncate" title={description}>
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
      cell: ({ row }) => (
        <Badge variant={row.getValue('is_active') ? 'default' : 'secondary'}>
          {row.getValue('is_active') ? 'Activa' : 'Inactiva'}
        </Badge>
      ),
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
            No se encontraron razas con los filtros aplicados.
          </EmptyDescription>
        </EmptyHeader>
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
                  <Badge variant={breed.is_active ? 'default' : 'secondary'}>
                    {breed.is_active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {breed.description}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Especie:</span>
                  <Badge variant="outline">{breed.species?.name}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Creado:</span>
                  <span>
                    {format(new Date(breed.created_at), 'dd/MM/yyyy')}
                  </span>
                </div>
              </div>
            </CardContent>
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
            <ItemMedia>
              <Dog className="h-10 w-10 text-muted-foreground" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{breed.name}</ItemTitle>
              <ItemDescription>{breed.description}</ItemDescription>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="outline">{breed.species?.name}</Badge>
                <Badge variant={breed.is_active ? 'default' : 'secondary'}>
                  {breed.is_active ? 'Activo' : 'Inactivo'}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {format(new Date(breed.created_at), 'dd/MM/yyyy')}
                  </span>
                </div>
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
