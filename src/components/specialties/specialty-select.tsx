'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown, GraduationCap, X, Plus, Edit } from 'lucide-react'
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
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'
import { Tables } from '@/types/supabase.types'

type Specialty = Tables<'specialties'>

interface SpecialtySelectProps {
  value?: string[]
  onValueChange: (value: string[]) => void
  placeholder?: string
  disabled?: boolean
  multiple?: boolean
  className?: string
}

export function SpecialtySelect({
  value = [],
  onValueChange,
  placeholder = 'Seleccionar especialidad...',
  disabled = false,
  multiple = true,
  className,
}: SpecialtySelectProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { currentTenant } = useCurrentTenantStore()

  const { data: specialties = [], isLoading } = useQuery({
    queryKey: ['specialties', currentTenant?.id, searchTerm],
    queryFn: async () => {
      if (!currentTenant?.id) return []

      let query = supabase
        .from('specialties')
        .select('*')
        .eq('tenant_id', currentTenant.id)
        .eq('is_active', true)
        .order('name')

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Error al obtener especialidades: ${error.message}`)
      }

      return data || []
    },
    enabled: !!currentTenant?.id,
  })

  const selectedSpecialties = specialties.filter((specialty: Specialty) =>
    value.includes(specialty.id)
  )

  const handleSelect = (specialtyId: string) => {
    if (multiple) {
      const newValue = value.includes(specialtyId)
        ? value.filter((id) => id !== specialtyId)
        : [...value, specialtyId]
      onValueChange(newValue)
    } else {
      onValueChange(value.includes(specialtyId) ? [] : [specialtyId])
      setOpen(false)
    }
  }

  const displayText = () => {
    if (selectedSpecialties.length === 0) {
      return placeholder
    }
    if (selectedSpecialties.length === 1) {
      return selectedSpecialties[0].name
    }
    return `${selectedSpecialties.length} especialidades seleccionadas`
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
              {selectedSpecialties.length > 0 ? (
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-muted-foreground" />
                  <span className="truncate">{displayText()}</span>
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
                placeholder="Buscar especialidad..."
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              <CommandEmpty>
                {isLoading ? 'Cargando...' : 'No se encontraron especialidades.'}
              </CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {specialties.map((specialty: Specialty) => (
                  <CommandItem
                    key={specialty.id}
                    value={specialty.name}
                    onSelect={() => handleSelect(specialty.id)}
                  >
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{specialty.name}</span>
                    </div>
                    <Check
                      className={cn(
                        'h-4 w-4',
                        value.includes(specialty.id) ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        {selectedSpecialties.length > 0 && (
          <InputGroupButton
            variant="ghost"
            onClick={() => onValueChange([])}
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
