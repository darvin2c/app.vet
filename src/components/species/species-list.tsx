'use client'

import { useState, useMemo } from 'react'
import { Tables } from '@/types/supabase.types'
import { SpeciesCreateButton } from './species-create-button'
import { useOrderBy } from '@/components/ui/order-by/use-order-by'
import { OrderByConfig } from '@/components/ui/order-by'
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
import { FilterConfig, useFilters } from '@/components/ui/filters'
import { useSearch } from '@/hooks/use-search'
import { ViewModeToggle, ViewMode } from '@/components/ui/view-mode-toggle'
import { SpeciesTableView } from './species-table-view'
import { SpeciesCardsView } from './species-cards-view'
import { SpeciesListView } from './species-list-view'

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
    filters: [
      {
        key: 'is_active',
        field: 'is_active',
        operator: 'eq',
        value: true,
        type: 'boolean',
      },
    ],
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
      {viewMode === 'list' && (
        <SpeciesListView
          species={hierarchicalData}
          appliedSearch={appliedSearch}
        />
      )}
      {viewMode === 'cards' && (
        <SpeciesCardsView
          species={hierarchicalData}
          appliedSearch={appliedSearch}
        />
      )}
    </div>
  )
}
