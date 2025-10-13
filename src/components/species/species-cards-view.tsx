'use client'

import { useMemo } from 'react'
import { Tables } from '@/types/supabase.types'
import { SpeciesActions } from './species-actions'
import { IsActiveDisplay } from '@/components/ui/is-active-field'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type Species = Tables<'species'>
type Breed = Tables<'breeds'>

type HierarchicalSpecies = Species & {
  subRows?: Breed[]
}

interface SpeciesCardsViewProps {
  species: HierarchicalSpecies[]
}

export function SpeciesCardsView({ species }: SpeciesCardsViewProps) {
  const renderCardsView = useMemo(
    () => (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {species.map((speciesItem) => (
          <Card key={speciesItem.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{speciesItem.name}</CardTitle>
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
                  {new Date(speciesItem.created_at).toLocaleDateString('es-ES')}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    ),
    [species]
  )

  return renderCardsView
}