'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useSpeciesList } from '@/hooks/species/use-species-list'
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

interface SpeciesSelectProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function SpeciesSelect({
  value,
  onValueChange,
  placeholder = 'Seleccionar especie...',
  disabled = false,
}: SpeciesSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { data: species = [], isLoading } = useSpeciesList({
    search: searchTerm,
    is_active: true,
  })

  const selectedSpecies = species.find((s) => s.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedSpecies ? selectedSpecies.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Buscar especie..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? 'Cargando...' : 'No se encontraron especies.'}
            </CommandEmpty>
            <CommandGroup>
              {species.map((s) => (
                <CommandItem
                  key={s.id}
                  value={s.id}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? '' : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === s.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {s.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
