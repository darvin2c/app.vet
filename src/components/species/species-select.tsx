'use client'

import { EntitySelect } from '@/components/ui/entity-select'
import { useSpeciesList } from '@/hooks/species/use-species-list'
import { Tables } from '@/types/supabase.types'
import { PawPrint } from 'lucide-react'

type Species = Tables<'species'>

interface SpeciesSelectProps {
  value?: string | string[]
  onValueChange?: (value: any) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  multiple?: boolean
}

export function SpeciesSelect({
  value,
  onValueChange,
  placeholder = 'Seleccionar especie...',
  disabled = false,
  className,
  multiple = false,
}: SpeciesSelectProps) {
  const { species, isLoading, searchTerm, setSearchTerm } = useSpeciesList()

  return (
    <EntitySelect<Species>
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      className={className}
      placeholder={placeholder}
      items={species}
      isPending={isLoading}
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
      multiple={multiple}
      renderItem={(specie) => (
        <div className="flex items-center gap-2">
          <PawPrint className="w-4 h-4 text-muted-foreground" />
          <span>{specie.name}</span>
        </div>
      )}
      renderSelected={(specie) => (
        <div className="flex items-center gap-2">
          <PawPrint className="w-4 h-4 text-muted-foreground" />
          <span>{specie.name}</span>
        </div>
      )}
    />
  )
}
