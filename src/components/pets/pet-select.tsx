'use client'

import { EntitySelect } from '@/components/ui/entity-select'
import { usePetList } from '@/hooks/pets/use-pet-list'
import { PetCreate } from './pet-create'
import { PetEdit } from './pet-edit'
import { Tables } from '@/types/supabase.types'
import { useState } from 'react'

type Pet = Tables<'pets'> & {
  breeds: { id: string; name: string } | null
  species: { id: string; name: string } | null
}

interface PetSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  customerId?: string
}

export function PetSelect({
  value,
  onValueChange,
  placeholder = 'Seleccionar mascota...',
  disabled = false,
  className,
  customerId,
}: PetSelectProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const { data, isLoading } = usePetList({
    search: searchTerm,
    filters: customerId
      ? [
          {
            field: 'customer_id',
            operator: 'eq',
            value: customerId,
          },
          {
            field: 'is_active',
            operator: 'eq',
            value: true,
          },
        ]
      : [],
  })
  const pets = data?.data || []

  return (
    <EntitySelect<Pet>
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      className={className}
      placeholder={placeholder}
      items={pets}
      isPending={isLoading}
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
      renderCreate={(props) => <PetCreate {...props} clientId={customerId} />}
      renderEdit={(props) => {
        const pet = pets.find((p) => p.id === props.id)
        if (!pet) return null
        return <PetEdit {...props} pet={pet} />
      }}
      renderItem={(pet) => (
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <span>{pet.name}</span>
            {pet.breeds && (
              <span className="text-sm text-muted-foreground">
                {pet.breeds.name}
              </span>
            )}
          </div>
        </div>
      )}
      renderSelected={(pet) => (
        <div className="flex flex-col items-center">
          <span>{pet.name}</span>
          {pet.breeds && (
            <span className="text-xs text-muted-foreground">
              {pet.breeds.name}
            </span>
          )}
        </div>
      )}
    />
  )
}
