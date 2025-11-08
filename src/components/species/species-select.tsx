'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown, Zap, X, Plus, Edit } from 'lucide-react'
import { useSpeciesList } from '@/hooks/species/use-species-list'
import { Tables } from '@/types/supabase.types'

type Species = Tables<'species'>
import { cn } from '@/lib/utils'
import { InputGroup, InputGroupButton } from '@/components/ui/input-group'
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
import { usePagination } from '../ui/pagination'

interface SpeciesSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function SpeciesSelect({
  value,
  onValueChange,
  placeholder = 'Seleccionar especie...',
  disabled = false,
  className,
}: SpeciesSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { appliedPagination } = usePagination()
  const { data, isLoading } = useSpeciesList({
    search: searchTerm,
    filters: [
      {
        field: 'is_active',
        operator: 'eq',
        value: true,
      },
    ],
    pagination: appliedPagination,
  })
  const species = data?.data || []

  const selectedSpecies = species.find((s: Species) => s.id === value)

  const handleSelect = (speciesId: string) => {
    if (!onValueChange) return
    onValueChange(value === speciesId ? '' : speciesId)
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
              {selectedSpecies ? (
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedSpecies.name}</span>
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
                placeholder="Buscar especie..."
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              <CommandEmpty>
                {isLoading ? 'Cargando...' : 'No se encontraron especies.'}
              </CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {species.map((s: Species) => (
                  <CommandItem
                    key={s.id}
                    value={s.name}
                    onSelect={() => handleSelect(s.id)}
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{s.name}</span>
                    </div>
                    <Check
                      className={cn(
                        'h-4 w-4',
                        value === s.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        {selectedSpecies && (
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
      </InputGroup>
    </>
  )
}
