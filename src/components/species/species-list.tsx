'use client'

import { useState, useCallback, useMemo } from 'react'
import { Tables } from '@/types/supabase.types'
import { SpeciesActions } from './species-actions'
import { SpeciesCreateButton } from './species-create-button'
import { IsActiveDisplay } from '@/components/ui/is-active-field'
import { useOrderBy } from '@/hooks/use-order-by'
import { OrderByConfig } from '@/types/order-by.types'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import { Stethoscope } from 'lucide-react'
import { useSpeciesList } from '@/hooks/species/use-species-list'
import { useBreedsList } from '@/hooks/breeds/use-breed-list'
import { useFilters } from '@/hooks/use-filters'
import { FilterConfig } from '@/types/filters.types'
import { useSearch } from '@/hooks/use-search'
import { ViewModeToggle, ViewMode } from '@/components/ui/view-mode-toggle'
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
} from '@/components/ui/item'
import { SpeciesTableView } from './species-table-view'

type Species = Tables<'species'>
type Breed = Tables<'breeds'>

// Tipo para las filas de la tabla jerárquica
type HierarchicalSpecies = Species & {
  subRows?: Breed[]
}

export function SpeciesList({
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

  const {
    data: species = [],
    isPending,
    error,
  } = useSpeciesList({
    filters: appliedFilters,
    search: appliedSearch,
    orders: orderByHook.appliedSorts,
  })

  // Obtener todas las razas para la vista jerárquica
  const { data: allBreeds = [] } = useBreedsList({
    filters: [{ field: 'is_active', operator: 'eq', value: true }],
    search: appliedSearch,
  })

  // Crear datos jerárquicos con subRows para react-table
  const hierarchicalData: HierarchicalSpecies[] = useMemo(() => {
    const result = species.map((speciesItem) => {
      // Solo obtener razas activas para esta especie
      const speciesBreeds = allBreeds.filter(
        (breed) => breed.species_id === speciesItem.id && breed.is_active
      )

      // Filtrar razas según búsqueda si existe
      let filteredBreeds = speciesBreeds

      if (appliedSearch) {
        filteredBreeds = speciesBreeds.filter(
          (breed) =>
            breed.name.toLowerCase().includes(appliedSearch.toLowerCase()) ||
            (breed.description &&
              breed.description
                .toLowerCase()
                .includes(appliedSearch.toLowerCase()))
        )
      }

      const hasActiveBreeds = filteredBreeds.length > 0

      return {
        ...speciesItem,
        subRows: hasActiveBreeds ? filteredBreeds : undefined,
      }
    })

    return result
  }, [species, allBreeds, appliedSearch])

  const renderListView = useCallback(
    () => (
      <ItemGroup>
        {species.map((speciesItem) => (
          <Item key={speciesItem.id}>
            <ItemContent>
              <ItemTitle>{speciesItem.name}</ItemTitle>
              <ItemDescription>
                <div className="space-y-1">
                  {speciesItem.description && (
                    <p className="text-sm text-muted-foreground">
                      {speciesItem.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-xs">Estado:</span>
                    <IsActiveDisplay value={speciesItem.is_active} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Creado:{' '}
                    {new Date(speciesItem.created_at).toLocaleDateString(
                      'es-ES'
                    )}
                  </p>
                </div>
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <SpeciesActions species={speciesItem} />
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
    ),
    [species]
  )

  const renderCardsView = useCallback(
    () => (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {species.map((speciesItem) => (
          <div key={speciesItem.id} className="rounded-lg border p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold">{speciesItem.name}</h3>
                {speciesItem.description && (
                  <p className="text-sm text-muted-foreground">
                    {speciesItem.description}
                  </p>
                )}
              </div>
              <SpeciesActions species={speciesItem} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span>Estado:</span>
                <IsActiveDisplay value={speciesItem.is_active} />
              </div>
              <span className="text-muted-foreground">
                {new Date(speciesItem.created_at).toLocaleDateString('es-ES')}
              </span>
            </div>
          </div>
        ))}
      </div>
    ),
    [species]
  )

  if (isPending) {
    return <TableSkeleton />
  }

  if (error) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <Stethoscope className="h-8 w-8" />
          </EmptyMedia>
          <EmptyTitle>Error al cargar especies</EmptyTitle>
          <EmptyDescription>
            Ocurrió un error al cargar las especies. Por favor, intenta
            nuevamente.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (species.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <Stethoscope className="h-8 w-8" />
          </EmptyMedia>
          <EmptyTitle>No hay especies registradas</EmptyTitle>
          <EmptyDescription>
            Comienza agregando tu primera especie para organizar las razas de
            animales.
          </EmptyDescription>
        </EmptyHeader>
        <SpeciesCreateButton />
      </Empty>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ViewModeToggle onValueChange={setViewMode} resource="species" />
        </div>
      </div>

      {viewMode === 'table' && (
        <SpeciesTableView
          hierarchicalData={hierarchicalData}
          orderByHook={orderByHook}
          appliedSearch={appliedSearch}
        />
      )}
      {viewMode === 'list' && renderListView()}
      {viewMode === 'cards' && renderCardsView()}
    </div>
  )
}
