'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown, Calendar, X, Plus, Edit } from 'lucide-react'
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
import { useAppointmentTypes } from '@/hooks/appointment-types/use-appointment-types'
import { cn } from '@/lib/utils'
import { AppointmentTypeCreate } from './appointment-type-create'
import { AppointmentTypeEdit } from './appointment-type-edit'
import { InputGroup, InputGroupButton } from '../ui/input-group'
import { Database } from '@/types/supabase.types'

type AppointmentType = Database['public']['Tables']['appointment_types']['Row']

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

  const { data: appointmentTypes = [], isLoading } = useAppointmentTypes({
    is_active: true,
  })

  const selectedAppointmentType = appointmentTypes.find(
    (type) => type.id === value
  )

  // Función para manejar la creación de un nuevo tipo de cita
  const handleAppointmentTypeCreated = (newType: AppointmentType) => {
    if (onValueChange) {
      onValueChange(newType.id)
    }
  }

  return (
    <>
      <InputGroup className={className}>
        {/* Selector principal - debe verse como un input real */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <InputGroupButton
              variant="ghost"
              role="combobox"
              aria-expanded={open}
              className="flex-1 justify-between h-9 px-3 py-2 text-left font-normal"
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
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Buscar tipo de cita..." />
              <CommandList>
                <CommandEmpty>
                  {isLoading
                    ? 'Cargando...'
                    : 'No se encontraron tipos de cita.'}
                </CommandEmpty>
                <CommandGroup>
                  {appointmentTypes?.map((type) => (
                    <CommandItem
                      key={type.id}
                      value={type.name}
                      onSelect={() => {
                        onValueChange?.(type.id === value ? '' : type.id)
                        setOpen(false)
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{type.name}</div>
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
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Botones de acción agrupados naturalmente */}
        {selectedAppointmentType && (
          <InputGroupButton
            variant="ghost"
            onClick={() => onValueChange?.('')}
            disabled={disabled}
            aria-label="Eliminar tipo de cita seleccionado"
          >
            <X className="h-4 w-4" />
          </InputGroupButton>
        )}

        <InputGroupButton
          variant="ghost"
          onClick={() => setCreateOpen(true)}
          disabled={disabled}
          aria-label="Crear nuevo tipo de cita"
        >
          <Plus className="h-4 w-4" />
        </InputGroupButton>

        {selectedAppointmentType && (
          <InputGroupButton
            variant="ghost"
            onClick={() => setEditOpen(true)}
            disabled={disabled}
            aria-label="Editar tipo de cita seleccionado"
          >
            <Edit className="h-4 w-4" />
          </InputGroupButton>
        )}
      </InputGroup>

      <AppointmentTypeCreate
        open={createOpen}
        onOpenChange={setCreateOpen}
        onAppointmentTypeCreated={handleAppointmentTypeCreated}
      />

      {selectedAppointmentType && (
        <AppointmentTypeEdit
          appointmentType={selectedAppointmentType}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      )}
    </>
  )
}
