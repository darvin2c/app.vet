'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown, GraduationCap } from 'lucide-react'
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
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'

interface SpecialtySelectProps {
  value?: string[]
  onValueChange: (value: string[]) => void
  placeholder?: string
  disabled?: boolean
  multiple?: boolean
}

export function SpecialtySelect({
  value = [],
  onValueChange,
  placeholder = 'Seleccionar especialidad...',
  disabled = false,
  multiple = true,
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

  const selectedSpecialties = specialties.filter((specialty) =>
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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{displayText()}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Buscar especialidad..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? 'Cargando...' : 'No se encontraron especialidades.'}
            </CommandEmpty>
            <CommandGroup>
              {specialties.map((specialty) => (
                <CommandItem
                  key={specialty.id}
                  value={specialty.name}
                  onSelect={() => handleSelect(specialty.id)}
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    <span>{specialty.name}</span>
                  </div>
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      value.includes(specialty.id) ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}