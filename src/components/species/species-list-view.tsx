'use client'

import { useState, useMemo, useEffect } from 'react'
import { Tables } from '@/types/supabase.types'
import { SpeciesActions } from './species-actions'
import { BreedActions } from '@/components/breeds/breed-actions'
import { IsActiveDisplay } from '@/components/ui/is-active-field'
import { Button } from '@/components/ui/button'
import { ChevronRight, ChevronDown } from 'lucide-react'
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
} from '@/components/ui/item'

type Species = Tables<'species'>
type Breed = Tables<'breeds'>

type HierarchicalSpecies = Species & {
  subRows?: Breed[]
}

interface SpeciesListViewProps {
  species: HierarchicalSpecies[]
  appliedSearch?: string
}

export function SpeciesListView({
  species,
  appliedSearch,
}: SpeciesListViewProps) {
  // Estado para filas expandidas
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  // Auto-expandir especies cuando se busca una raza
  useEffect(() => {
    if (appliedSearch) {
      const newExpanded: Record<string, boolean> = {}
      species.forEach((speciesItem) => {
        if (speciesItem.subRows && speciesItem.subRows.length > 0) {
          // Verificar si alguna raza coincide con la búsqueda
          const hasMatchingBreed = speciesItem.subRows.some(
            (breed) =>
              breed.name.toLowerCase().includes(appliedSearch.toLowerCase()) ||
              (breed.description &&
                breed.description
                  .toLowerCase()
                  .includes(appliedSearch.toLowerCase()))
          )
          if (hasMatchingBreed) {
            newExpanded[speciesItem.id] = true
          }
        }
      })
      setExpanded(newExpanded)
    }
  }, [appliedSearch, species])

  const toggleExpanded = (speciesId: string) => {
    setExpanded((prev) => ({
      ...prev,
      [speciesId]: !prev[speciesId],
    }))
  }

  const renderListView = useMemo(
    () => (
      <ItemGroup>
        {species.map((speciesItem) => {
          const hasActiveBreeds =
            speciesItem.subRows && speciesItem.subRows.length > 0
          const isExpanded = expanded[speciesItem.id]

          return (
            <div key={speciesItem.id}>
              {/* Especie principal */}
              <Item variant="outline">
                <ItemContent>
                  <div className="flex items-center gap-2">
                    {/* Botón de expansión */}
                    {hasActiveBreeds ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(speciesItem.id)}
                        className="p-1 h-6 w-6 hover:bg-muted rounded flex items-center justify-center transition-colors"
                        aria-label={
                          isExpanded ? 'Contraer razas' : 'Expandir razas'
                        }
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    ) : (
                      <div className="w-6" />
                    )}

                    <div className="flex-1">
                      <ItemTitle>
                        {speciesItem.name}
                        {hasActiveBreeds && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({speciesItem.subRows?.length || 0} razas)
                          </span>
                        )}
                      </ItemTitle>
                      {speciesItem.description && (
                        <ItemDescription>
                          {speciesItem.description}
                        </ItemDescription>
                      )}
                      <div className="flex items-center justify-between text-sm mt-2">
                        <div className="flex items-center gap-2">
                          <span>Estado:</span>
                          <IsActiveDisplay value={speciesItem.is_active} />
                        </div>
                        <span className="text-muted-foreground">
                          {new Date(speciesItem.created_at).toLocaleDateString(
                            'es-ES'
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </ItemContent>
                <ItemActions>
                  <SpeciesActions species={speciesItem} />
                </ItemActions>
              </Item>

              {/* Razas expandidas */}
              {isExpanded && hasActiveBreeds && (
                <div className="ml-8 mt-2 space-y-2">
                  {speciesItem.subRows?.map((breed) => (
                    <Item key={breed.id} variant="muted" size="sm">
                      <ItemContent>
                        <ItemTitle className="text-sm text-muted-foreground">
                          {breed.name}
                        </ItemTitle>
                        {breed.description && (
                          <ItemDescription className="text-xs">
                            {breed.description}
                          </ItemDescription>
                        )}
                        <div className="flex items-center justify-between text-xs mt-1">
                          <div className="flex items-center gap-2">
                            <span>Estado:</span>
                            <IsActiveDisplay value={breed.is_active} />
                          </div>
                          <span className="text-muted-foreground">
                            {new Date(breed.created_at).toLocaleDateString(
                              'es-ES'
                            )}
                          </span>
                        </div>
                      </ItemContent>
                      <ItemActions>
                        <BreedActions breed={breed} />
                      </ItemActions>
                    </Item>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </ItemGroup>
    ),
    [species, expanded]
  )

  return renderListView
}
