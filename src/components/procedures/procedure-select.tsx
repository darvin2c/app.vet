'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown, Stethoscope, X, Plus, Edit } from 'lucide-react'
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
import { InputGroup, InputGroupButton } from '@/components/ui/input-group'
import useProcedures from '@/hooks/procedures/use-procedures'
import { cn } from '@/lib/utils'
import { ProcedureCreate } from './procedure-create'
import { ProcedureEdit } from './procedure-edit'

interface ProcedureSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function ProcedureSelect({
  value,
  onValueChange,
  placeholder = 'Seleccionar procedimiento...',
  disabled = false,
}: ProcedureSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const { data: procedures = [], isLoading } = useProcedures({
    search: searchTerm,
    is_active: true,
  })

  const selectedProcedure = procedures.find(
    (procedure: any) => procedure.id === value
  )

  return (
    <>
      <InputGroup>
        {/* Selector principal con Popover */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <InputGroupButton
              variant="ghost"
              role="combobox"
              aria-expanded={open}
              className="flex-1 justify-between h-9 px-3 py-2 text-left font-normal"
              disabled={disabled}
            >
              {selectedProcedure ? (
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedProcedure.name}</span>
                </div>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </InputGroupButton>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput
                placeholder="Buscar procedimiento..."
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              <CommandList>
                <CommandEmpty>
                  {isLoading
                    ? 'Cargando...'
                    : 'No se encontraron procedimientos.'}
                </CommandEmpty>
                <CommandGroup>
                  {procedures?.map((procedure: any) => (
                    <CommandItem
                      key={procedure.id}
                      value={procedure.name}
                      onSelect={() => {
                        onValueChange?.(
                          procedure.id === value ? '' : procedure.id
                        )
                        setOpen(false)
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{procedure.name}</div>
                          {procedure.description && (
                            <div className="text-sm text-muted-foreground">
                              {procedure.description}
                            </div>
                          )}
                        </div>
                      </div>
                      <Check
                        className={cn(
                          'h-4 w-4',
                          value === procedure.id ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Botón limpiar (condicional) */}
        {selectedProcedure && (
          <InputGroupButton
            variant="ghost"
            onClick={() => onValueChange?.('')}
            disabled={disabled}
            aria-label="Limpiar selección"
          >
            <X className="h-4 w-4" />
          </InputGroupButton>
        )}

        {/* Botón crear */}
        <InputGroupButton
          variant="ghost"
          onClick={() => setCreateOpen(true)}
          disabled={disabled}
          aria-label="Crear nuevo procedimiento"
        >
          <Plus className="h-4 w-4" />
        </InputGroupButton>

        {/* Botón editar (condicional) */}
        {selectedProcedure && (
          <InputGroupButton
            variant="ghost"
            onClick={() => setEditOpen(true)}
            disabled={disabled}
            aria-label="Editar procedimiento seleccionado"
          >
            <Edit className="h-4 w-4" />
          </InputGroupButton>
        )}
      </InputGroup>

      <ProcedureCreate open={createOpen} onOpenChange={setCreateOpen} />

      {selectedProcedure && (
        <ProcedureEdit
          procedure={selectedProcedure}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      )}
    </>
  )
}
