'use client'

import { useMemo, useState, useEffect } from 'react'
import { Tables } from '@/types/supabase.types'
import { SpeciesActions } from './species-actions'
import { BreedActions } from '../breeds/breed-actions'
import { IsActiveDisplay } from '@/components/ui/is-active-field'
import { Button } from '@/components/ui/button'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Species = Tables<'species'>
type Breed = Tables<'breeds'>

type HierarchicalSpecies = Species & {
  subRows?: Breed[]
}

interface SpeciesCardsViewProps {
  species: HierarchicalSpecies[]
  appliedSearch?: string
}

export function SpeciesCardsView({
  species,
  appliedSearch,
}: SpeciesCardsViewProps) {
  // Estado para controlar qué especies están expandidas
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  // Auto-expandir especies cuando se busca una raza
  useEffect(() => {
    if (appliedSearch && appliedSearch.trim() !== '') {
      const newExpandedRows = new Set<string>()

      species.forEach((speciesItem) => {
        if (speciesItem.subRows && speciesItem.subRows.length > 0) {
          const hasMatchingBreed = speciesItem.subRows.some((breed) =>
            breed.name.toLowerCase().includes(appliedSearch.toLowerCase())
          )
          if (hasMatchingBreed) {
            newExpandedRows.add(speciesItem.id)
          }
        }
      })

      setExpandedRows(newExpandedRows)
    }
  }, [appliedSearch, species])

  const toggleExpanded = (speciesId: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(speciesId)) {
        newSet.delete(speciesId)
      } else {
        newSet.add(speciesId)
      }
      return newSet
    })
  }

  const renderCardsView = useMemo(
    () => (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {species.map((speciesItem) => {
          const isExpanded = expandedRows.has(speciesItem.id)
          const hasActiveBreeds =
            speciesItem.subRows && speciesItem.subRows.length > 0

          return (
            <Card
              key={speciesItem.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {hasActiveBreeds && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => toggleExpanded(speciesItem.id)}
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                    <CardTitle className="text-lg">
                      {speciesItem.name}
                    </CardTitle>
                  </div>
                  <SpeciesActions species={speciesItem} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {speciesItem.description && (
                  <p className="text-sm text-muted-foreground">
                    {speciesItem.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-sm">
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

                {/* Razas expandidas como mini-cards */}
                {isExpanded && hasActiveBreeds && (
                  <div className="mt-4 space-y-2 border-t pt-3">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Razas:
                    </h4>
                    <div className="space-y-2">
                      {speciesItem.subRows!.map((breed) => (
                        <div
                          key={breed.id}
                          className="rounded-md border border-muted bg-muted/30 p-3 transition-colors hover:bg-muted/50"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium text-sm truncate">
                                {breed.name}
                              </h5>
                              {breed.description && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {breed.description}
                                </p>
                              )}
                              <div className="flex items-center gap-3 mt-2 text-xs">
                                <div className="flex items-center gap-1">
                                  <span>Estado:</span>
                                  <IsActiveDisplay value={breed.is_active} />
                                </div>
                                <span className="text-muted-foreground">
                                  {new Date(
                                    breed.created_at
                                  ).toLocaleDateString('es-ES')}
                                </span>
                              </div>
                            </div>
                            <div className="ml-2 flex-shrink-0">
                              <BreedActions breed={breed} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    ),
    [species, expandedRows]
  )

  return renderCardsView
}
