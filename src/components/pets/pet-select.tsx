'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown, Search } from 'lucide-react'
import { usePets } from '@/hooks/pets/use-pet-list'
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

interface PetSelectProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  clientId?: string
}

export function PetSelect({ 
  value, 
  onValueChange, 
  placeholder = "Seleccionar mascota...",
  clientId 
}: PetSelectProps) {
  const [open, setOpen] = useState(false)
  const { data: pets, isLoading } = usePets(clientId ? { client_id: clientId } : undefined)

  const selectedPet = pets?.find((pet) => pet.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedPet ? (
            <span className="flex items-center gap-2">
              <span>{selectedPet.name}</span>
              <span className="text-muted-foreground text-sm">
                ({selectedPet.species})
              </span>
            </span>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Buscar mascota..." />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Cargando..." : "No se encontraron mascotas."}
            </CommandEmpty>
            <CommandGroup>
              {pets?.map((pet) => (
                <CommandItem
                  key={pet.id}
                  value={pet.id}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === pet.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{pet.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {pet.species} - {pet.clients?.name}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}