'use client'

import { useState } from 'react'
import { Calendar, Check, ChevronsUpDown, Plus, X, Edit } from 'lucide-react'
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
import { useAppointmentTypeList } from '@/hooks/appointment-types/use-appointment-type-list'
import { AppointmentTypeCreate } from './appointment-type-create'
import { AppointmentTypeEdit } from './appointment-type-edit'
import { Tables } from '@/types/supabase.types'

type AppointmentType = Tables<'appointment_types'>

interface AppointmentTypeSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function AppointmentTypeSelect({
  value,
  onValueChange,
  placeholder = 'Seleccionar tipo de cita...',
  disabled = false,
  className,
}: AppointmentTypeSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  
  const { data: appointmentTypes = [], isLoading } = useAppointmentTypeList({
    search: searchTerm,
  })

  const selectedAppointmentType = appointmentTypes.find(
    (type: AppointmentType) => type.id === value
  )

  const handleSelect = (typeId: string) => {
    if (!onValueChange) return
    onValueChange(value === typeId ? '' : typeId)
    setOpen(false)
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
              className="flex-1 justify-between h-full px-3 py-2 text-left font-normal"
              disabled={disabled}
            >
              {selectedAppointmentType ? (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedAppointmentType.name}</span>
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
                placeholder="Buscar tipo de cita..."
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              <CommandEmpty>
                {isLoading ? 'Cargando...' : 'No se encontraron tipos de cita.'}
              </CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {appointmentTypes.map((type: AppointmentType) => (
                  <CommandItem
                    key={type.id}
                    value={type.name}
                    onSelect={() => handleSelect(type.id)}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span>{type.name}</span>
                        {type.description && (
                          <span className="text-sm text-muted-foreground">
                            {type.description}
                          </span>
                        )}
                      </div>
                    </div>
                    <Check
                      className={cn(
                        'h-4 w-4',
                        value === type.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        {selectedAppointmentType && (
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
          aria-label="Crear nuevo tipo de cita"
          className="h-full"
        >
          <Plus className="h-4 w-4" />
        </InputGroupButton>

        {selectedAppointmentType && (
          <InputGroupButton
            variant="ghost"
            onClick={() => setEditOpen(true)}
            disabled={disabled}
            aria-label="Editar tipo de cita seleccionado"
            className="h-full"
          >
            <Edit className="h-4 w-4" />
          </InputGroupButton>
        )}
      </InputGroup>

      <AppointmentTypeCreate 
        open={createOpen} 
        onOpenChange={setCreateOpen}
        onAppointmentTypeCreated={() => {
          // Refresh data if needed
        }}
      />

      {selectedAppointmentType && (
        <AppointmentTypeEdit
          open={editOpen}
          onOpenChange={setEditOpen}
          appointmentType={selectedAppointmentType}
        />
      )}
    </>
  )
}