'use client'

import { EntitySelect } from '@/components/ui/entity-select'
import { useBreedsList } from '@/hooks/breeds/use-breed-list'
import { BreedCreate } from './breed-create'
import { BreedEdit } from './breed-edit'
import { Tables } from '@/types/supabase.types'
import { Dog } from 'lucide-react'

type Breed = Tables<'breeds'> & { species?: Tables<'species'> | null }

interface BreedSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  speciesId?: string
}

export function BreedSelect({
  value,
  onValueChange,
  placeholder = 'Seleccionar raza...',
  disabled = false,
  className,
  speciesId,
}: BreedSelectProps) {
  const { data, isLoading, searchTerm, setSearchTerm } = useBreedsList({
    search: searchTerm,
    species_id: speciesId,
  })
  const breeds = data?.data || []

  return (
    <EntitySelect<Breed>
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      className={className}
      placeholder={placeholder}
      items={breeds}
      isPending={isLoading}
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
      renderCreate={(props) => (
        <BreedCreate {...props} selectedSpeciesId={speciesId} />
      )}
      renderEdit={(props) => {
        const breed = breeds.find((b) => b.id === props.id)
        if (!breed) return null
        return <BreedEdit {...props} breed={breed} />
      }}
      renderItem={(breed) => (
        <div className="flex items-center gap-2">
          <Dog className="w-4 h-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span>{breed.name}</span>
            {breed.species && (
              <span className="text-sm text-muted-foreground">
                {breed.species.name}
              </span>
            )}
          </div>
        </div>
      )}
      renderSelected={(breed) => (
        <div className="flex items-center gap-2">
          <Dog className="w-4 h-4 text-muted-foreground" />
          <span>{breed.name}</span>
        </div>
      )}
    />
  )
}
