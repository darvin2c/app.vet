'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown, User, X, Plus, Edit } from 'lucide-react'
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
import usePatients from '@/hooks/patients/use-patients'
import { cn } from '@/lib/utils'
import { PatientCreate } from './patient-create'
import { PatientEdit } from './patient-edit'
import { InputGroup, InputGroupButton } from '../ui/input-group'

interface PatientSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function PatientSelect({
  value,
  onValueChange,
  placeholder = 'Seleccionar paciente...',
  disabled = false,
}: PatientSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const { data: patients = [], isLoading } = usePatients({
    search: searchTerm,
    is_active: true,
  })

  const selectedPatient = patients.find((patient) => patient.id === value)

  return (
    <>
      <InputGroup>
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
              {selectedPatient ? (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {selectedPatient.first_name} {selectedPatient.last_name}
                  </span>
                </div>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </InputGroupButton>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Buscar paciente..." />
              <CommandList>
                <CommandEmpty>No se encontraron pacientes.</CommandEmpty>
                <CommandGroup>
                  {patients?.map((patient) => (
                    <CommandItem
                      key={patient.id}
                      value={`${patient.first_name} ${patient.last_name} ${patient.email || ''}`}
                      onSelect={() => {
                        onValueChange?.(patient.id === value ? '' : patient.id)
                        setOpen(false)
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {patient.first_name} {patient.last_name}
                          </div>
                          {patient.email && (
                            <div className="text-sm text-muted-foreground">
                              {patient.email}
                            </div>
                          )}
                        </div>
                      </div>
                      <Check
                        className={cn(
                          'h-4 w-4',
                          value === patient.id ? 'opacity-100' : 'opacity-0'
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
        {selectedPatient && (
          <InputGroupButton
            variant="ghost"
            onClick={() => onValueChange?.('')}
            disabled={disabled}
            aria-label="Eliminar paciente seleccionado"
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </InputGroupButton>
        )}
        <InputGroupButton
          variant="ghost"
          onClick={() => setCreateOpen(true)}
          disabled={disabled}
          aria-label="Crear nuevo paciente"
          className="h-8 w-8"
        >
          <Plus className="h-4 w-4" />
        </InputGroupButton>
        {selectedPatient && (
          <InputGroupButton
            variant="ghost"
            onClick={() => setEditOpen(true)}
            disabled={disabled}
            aria-label="Editar paciente seleccionado"
            className="h-8 w-8"
          >
            <Edit className="h-4 w-4" />
          </InputGroupButton>
        )}

        <PatientCreate open={createOpen} onOpenChange={setCreateOpen} />
      </InputGroup>
      {selectedPatient && (
        <PatientEdit
          patient={selectedPatient}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      )}
    </>
  )
}
