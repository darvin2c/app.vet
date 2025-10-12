'use client'

import { useState, useEffect } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useBreedsList } from '@/hooks/breeds/use-breed-list'
import { Tables } from '@/types/supabase.types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface BreedSelectProps {
  value?: string
  onValueChange: (value: string) => void
  speciesId?: string
  placeholder?: string
  disabled?: boolean
}

export function BreedSelect({
  value,
  onValueChange,
  speciesId,
  placeholder = 'Seleccionar raza...',
  disabled = false,
}: BreedSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { data: breeds = [], isLoading } = useBreedsList({
    species_id: speciesId,
    search: searchTerm,
    is_active: true,
  })

  const selectedBreed = breeds.find((b) => b.id === value)

  // Limpiar selección cuando cambia la especie
  useEffect(() => {
    if (value && selectedBreed && selectedBreed.species_id !== speciesId) {
      onValueChange('')
    }
  }, [speciesId, value, selectedBreed, onValueChange])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled || !speciesId}
        >
          {selectedBreed ? selectedBreed.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Buscar raza..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading
                ? 'Cargando...'
                : !speciesId
                  ? 'Selecciona una especie primero'
                  : 'No se encontraron razas.'}
            </CommandEmpty>
            <CommandGroup>
              {breeds.map((breed) => (
                <CommandItem
                  key={breed.id}
                  value={breed.id}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? '' : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === breed.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {breed.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
