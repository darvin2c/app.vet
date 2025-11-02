'use client'

import { useState } from 'react'
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
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
import { BreedActions } from './breed-actions'
import { useBreedsList } from '@/hooks/breeds/use-breed-list'
import { Tables } from '@/types/supabase.types'
import { FilterConfig } from '@/types/filters.types'
import { OrderByConfig } from '@/components/ui/order-by'
import { useOrderBy } from '@/components/ui/order-by/use-order-by'
import { useSearch } from '@/hooks/use-search'
import { useFilters } from '@/hooks/use-filters'

type Breed = Tables<'breeds'> & {
  species: Tables<'species'> | null
}

interface BreedListProps {
  speciesId?: string
  filterConfig?: FilterConfig[]
  orderByConfig?: OrderByConfig
}

export function BreedList({
  speciesId,
  filterConfig = [],
  orderByConfig,
}: BreedListProps) {
  const [view, setView] = useState<'table' | 'card'>('table')
  const { appliedFilters } = useFilters()
  const { appliedSorts } = useOrderBy()
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
        <div className="font-medium">{row.getValue('name')}</div>
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
          <div className="max-w-[200px] truncate">{description}</div>
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

  if (view === 'card') {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {breeds.map((breed) => (
          <Card key={breed.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{breed.name}</CardTitle>
                <BreedActions breed={breed} />
              </div>
              {breed.species && (
                <CardDescription>
                  <Badge variant="secondary">{breed.species.name}</Badge>
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {breed.description && (
                <p className="text-sm text-muted-foreground mb-3">
                  {breed.description}
                </p>
              )}
              <div className="flex items-center justify-between">
                <Badge
                  variant={breed.is_active ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {breed.is_active ? 'Activa' : 'Inactiva'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant={view === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('table')}
          >
            Tabla
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
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
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
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
    </div>
  )
}
