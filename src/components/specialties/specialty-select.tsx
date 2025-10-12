'use client'

import { useState } from 'react'
import {
  Check,
  ChevronsUpDown,
  X,
  Plus,
  Edit,
  GraduationCap,
} from 'lucide-react'
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
import { Badge } from '@/components/ui/badge'
import useSpecialties from '@/hooks/specialties/use-specialties'
import { SpecialtyCreate } from './specialty-create'
import { SpecialtyEdit } from './specialty-edit'
import { Database } from '@/types/supabase.types'

type Specialty = Database['public']['Tables']['specialties']['Row']

interface SpecialtySelectProps {
  value?: string[]
  onValueChange?: (value: string[]) => void
  placeholder?: string
  multiple?: boolean
  disabled?: boolean
  className?: string
}

export function SpecialtySelect({
  value = [],
  onValueChange,
  placeholder = 'Seleccionar especialidades...',
  multiple = true,
  disabled = false,
  className,
}: SpecialtySelectProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const { data: specialties = [], isLoading } = useSpecialties({
    search: searchTerm,
    is_active: true, // Solo mostrar especialidades activas
  })

  const selectedSpecialties = specialties.filter((specialty) =>
    value.includes(specialty.id)
  )

  // Función para manejar la creación de una nueva especialidad
  const handleSpecialtyCreated = (newSpecialty: Specialty) => {
    if (onValueChange) {
      // Agregar automáticamente la nueva especialidad a la selección
      const newValue = [...value, newSpecialty.id]
      onValueChange(newValue)
    }
  }

  const handleSelect = (specialtyId: string) => {
    if (!onValueChange) return

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

  const handleRemove = (specialtyId: string) => {
    if (!onValueChange) return
    onValueChange(value.filter((id) => id !== specialtyId))
  }

  return (
    <>
      <InputGroup>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <InputGroupButton
              variant="ghost"
              role="combobox"
              aria-expanded={open}
              className="flex-1 justify-between h-9 px-3 py-2 text-left font-normal"
              disabled={disabled}
            >
              {selectedSpecialties.length > 0 ? (
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {selectedSpecialties.length === 1
                      ? selectedSpecialties[0].name
                      : `${selectedSpecialties.length} especialidades seleccionadas`}
                  </span>
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
                {isLoading
                  ? 'Cargando...'
                  : 'No se encontraron especialidades.'}
              </CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
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
                        'h-4 w-4',
                        value.includes(specialty.id)
                          ? 'opacity-100'
                          : 'opacity-0'
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
            onClick={() => onValueChange?.([])}
            disabled={disabled}
            aria-label="Limpiar selección"
          >
            <X className="h-4 w-4" />
          </InputGroupButton>
        )}

        <InputGroupButton
          variant="ghost"
          onClick={() => setCreateOpen(true)}
          disabled={disabled}
          aria-label="Crear nueva especialidad"
        >
          <Plus className="h-4 w-4" />
        </InputGroupButton>

        {selectedSpecialties.length === 1 && (
          <InputGroupButton
            variant="ghost"
            onClick={() => setEditOpen(true)}
            disabled={disabled}
            aria-label="Editar especialidad seleccionada"
          >
            <Edit className="h-4 w-4" />
          </InputGroupButton>
        )}
      </InputGroup>

      {/* Mostrar badges de especialidades seleccionadas cuando hay múltiples */}
      {multiple && selectedSpecialties.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedSpecialties.map((specialty) => (
            <Badge key={specialty.id} variant="secondary" className="text-xs">
              {specialty.name}
              {!disabled && (
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleRemove(specialty.id)
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={() => handleRemove(specialty.id)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}

      <SpecialtyCreate
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSpecialtyCreated={handleSpecialtyCreated}
      />

      {selectedSpecialties.length === 1 && (
        <SpecialtyEdit
          open={editOpen}
          onOpenChange={setEditOpen}
          specialty={selectedSpecialties[0]}
        />
      )}
    </>
  )
}
