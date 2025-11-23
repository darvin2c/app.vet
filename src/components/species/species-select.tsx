'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown, Zap, X } from 'lucide-react'
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
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Spinner } from '../ui/spinner'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '../ui/empty'

// Base props shared across both modes
type SpeciesSelectBaseProps = {
  placeholder?: string
  disabled?: boolean
  className?: string
}

// Single-select props
type SpeciesSelectSingleProps = SpeciesSelectBaseProps & {
  value?: string
  onValueChange?: (value: string) => void
  multiple?: false
}

// Multi-select props
type SpeciesSelectMultiProps = SpeciesSelectBaseProps & {
  value?: string[]
  onValueChange?: (value: string[]) => void
  multiple: true
}

// Discriminated union by `multiple`
type SpeciesSelectProps = SpeciesSelectSingleProps | SpeciesSelectMultiProps

export function SpeciesSelect(props: SpeciesSelectProps) {
  const multiple = props.multiple === true
  const value = props.value
  const onValueChange = props.onValueChange
  const {
    placeholder = 'Seleccionar especie...',
    disabled = false,
    className,
  } = props

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

  const selectedIds = multiple ? (Array.isArray(value) ? value : []) : []
  const singleValue = !multiple && typeof value === 'string' ? value : ''
  const selectedSpecies = !multiple
    ? species.find((s: Species) => s.id === singleValue)
    : undefined

  const handleSelect = (speciesId: string) => {
    if (!onValueChange) return
    if (multiple) {
      const next = selectedIds.includes(speciesId)
        ? selectedIds.filter((id) => id !== speciesId)
        : [...selectedIds, speciesId]
        ; (onValueChange as (v: string[]) => void)?.(next)
      // keep popover open in multi-select
      return
    }
    ; (onValueChange as (v: string) => void)?.(
      singleValue === speciesId ? '' : speciesId
    )
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
              {multiple ? (
                selectedIds.length > 0 ? (
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedIds.length} seleccionadas</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">{placeholder}</span>
                )
              ) : selectedSpecies ? (
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
              <CommandList>
                <CommandEmpty>
                  {isLoading ? <div className="min-h-[100px]"><Spinner /></div> :
                    <>
                      <Empty>
                        <EmptyHeader>
                          <EmptyMedia>
                            <Zap className="w-10 h-10 text-muted-foreground" />
                          </EmptyMedia>
                          <EmptyTitle>No se encontraron especies</EmptyTitle>
                        </EmptyHeader>
                      </Empty>
                    </>
                  }
                </CommandEmpty>
                <CommandGroup className="max-h-64 overflow-auto">
                  {species.map((s: Species) => (
                    <CommandItem
                      key={s.id}
                      value={s.name}
                      onSelect={() => handleSelect(s.id)}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarFallback>
                            {s.name.toUpperCase().slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{s.name}</span>
                      </div>
                      <Check
                        className={cn(
                          'h-4 w-4',
                          multiple
                            ? selectedIds.includes(s.id)
                              ? 'opacity-100'
                              : 'opacity-0'
                            : singleValue === s.id
                              ? 'opacity-100'
                              : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {(multiple ? selectedIds.length > 0 : !!selectedSpecies) && (
          <InputGroupButton
            variant="ghost"
            onClick={() =>
              multiple
                ? (onValueChange as (v: string[]) => void)?.([])
                : (onValueChange as (v: string) => void)?.('')
            }
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
