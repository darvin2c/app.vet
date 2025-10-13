'use client'

import { useState } from 'react'
import { Dog, Check, ChevronsUpDown, Plus, X, Edit } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupButton } from '@/components/ui/input-group'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useBreedsList } from '@/hooks/breeds/use-breed-list'
import { Tables } from '@/types/supabase.types'

type Breed = Tables<'breeds'> & { species: Tables<'species'> | null }

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
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const { data: breeds = [], isLoading } = useBreedsList({
    search: searchTerm,
    species_id: speciesId,
  })

  const selectedBreed = breeds.find((breed: Breed) => breed.id === value)

  const handleSelect = (breedId: string) => {
    if (!onValueChange) return
    onValueChange(value === breedId ? '' : breedId)
    setOpen(false)
  }

  return (
    <>
      <InputGroup className={className}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <InputGroupButton
              variant="ghost"
              role="combobox"
              aria-expanded={open}
              className="flex-1 justify-between h-full px-3 py-2 text-left font-normal"
              disabled={disabled}
            >
              {selectedBreed ? (
                <div className="flex items-center gap-2">
                  <Dog className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedBreed.name}</span>
                </div>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </InputGroupButton>
          </PopoverTrigger>
          <PopoverContent
            className="w-[--radix-popover-trigger-width] p-0"
            align="start"
          >
            <Command>
              <CommandInput
                placeholder="Buscar raza..."
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              <CommandEmpty>
                {isLoading ? 'Cargando...' : 'No se encontraron razas.'}
              </CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {breeds.map((breed: Breed) => (
                  <CommandItem
                    key={breed.id}
                    value={breed.name}
                    onSelect={() => handleSelect(breed.id)}
                  >
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
                    <Check
                      className={cn(
                        'h-4 w-4',
                        value === breed.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        {selectedBreed && (
          <InputGroupButton
            variant="ghost"
            onClick={() => onValueChange?.('')}
            disabled={disabled}
            aria-label="Limpiar selección"
            className="h-full"
          >
            <X className="h-4 w-4" />
          </InputGroupButton>
        )}

        <InputGroupButton
          variant="ghost"
          onClick={() => setCreateOpen(true)}
          disabled={disabled}
          aria-label="Crear nueva raza"
          className="h-full"
        >
          <Plus className="h-4 w-4" />
        </InputGroupButton>

        {selectedBreed && (
          <InputGroupButton
            variant="ghost"
            onClick={() => setEditOpen(true)}
            disabled={disabled}
            aria-label="Editar raza seleccionada"
            className="h-full"
          >
            <Edit className="h-4 w-4" />
          </InputGroupButton>
        )}
      </InputGroup>
    </>
  )
}
