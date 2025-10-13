'use client'

import { useState } from 'react'
import { Heart, Check, ChevronsUpDown, Plus, X, Edit } from 'lucide-react'
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
import { usePets } from '@/hooks/pets/use-pet-list'
import { PetCreate } from './pet-create'
import { PetEdit } from './pet-edit'
import { Tables } from '@/types/supabase.types'

type Pet = Tables<'pets'> & { breeds: Tables<'breeds'> | null }

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
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const { data: pets = [], isLoading } = usePets({
    search: searchTerm,
    filters: customerId ? [{ field: 'customer_id', operator: 'eq', value: customerId }] : [],
  })

  const selectedPet = pets.find((pet: Pet) => pet.id === value)

  const handleSelect = (petId: string) => {
    if (!onValueChange) return
    onValueChange(value === petId ? '' : petId)
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
              {selectedPet ? (
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedPet.name}</span>
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
                placeholder="Buscar mascota..."
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              <CommandEmpty>
                {isLoading ? 'Cargando...' : 'No se encontraron mascotas.'}
              </CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {pets.map((pet: Pet) => (
                  <CommandItem
                    key={pet.id}
                    value={pet.name}
                    onSelect={() => handleSelect(pet.id)}
                  >
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span>{pet.name}</span>
                        {pet.breeds && (
                          <span className="text-sm text-muted-foreground">
                            {pet.breeds.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <Check
                      className={cn(
                        'h-4 w-4',
                        value === pet.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        {selectedPet && (
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
          aria-label="Crear nueva mascota"
          className="h-full"
        >
          <Plus className="h-4 w-4" />
        </InputGroupButton>

        {selectedPet && (
          <InputGroupButton
            variant="ghost"
            onClick={() => setEditOpen(true)}
            disabled={disabled}
            aria-label="Editar mascota seleccionada"
            className="h-full"
          >
            <Edit className="h-4 w-4" />
          </InputGroupButton>
        )}
      </InputGroup>

      <PetCreate
        open={createOpen}
        onOpenChange={setCreateOpen}
        clientId={customerId}
      />

      {selectedPet && (
        <PetEdit
          open={editOpen}
          onOpenChange={setEditOpen}
          pet={selectedPet}
        />
      )}
    </>
  )
}
