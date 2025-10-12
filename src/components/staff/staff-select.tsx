'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown, UserCheck, X, Plus, Edit } from 'lucide-react'
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
import useStaff from '@/hooks/staff/use-staff'
import { cn } from '@/lib/utils'

interface StaffSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function StaffSelect({
  value,
  onValueChange,
  placeholder = 'Seleccionar personal...',
  disabled = false,
}: StaffSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const { data: staff = [], isLoading } = useStaff({
    search: searchTerm,
    is_active: true,
  })

  const selectedStaff = staff.find((member: any) => member.id === value)

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
              {selectedStaff ? (
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {selectedStaff.full_name}
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
              <CommandInput
                placeholder="Buscar personal..."
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              <CommandList>
                <CommandEmpty>
                  {isLoading ? 'Cargando...' : 'No se encontró personal.'}
                </CommandEmpty>
                <CommandGroup>
                  {staff.map((member: any) => (
                    <CommandItem
                      key={member.id}
                      value={member.id}
                      onSelect={(currentValue) => {
                        onValueChange?.(
                          currentValue === value ? '' : currentValue
                        )
                        setOpen(false)
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {member.full_name}
                          </div>
                          {member.email && (
                            <div className="text-sm text-muted-foreground">
                              {member.email}
                            </div>
                          )}
                        </div>
                      </div>
                      <Check
                        className={cn(
                          'h-4 w-4',
                          value === member.id ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {selectedStaff && (
          <InputGroupButton
            variant="ghost"
            onClick={() => onValueChange?.('')}
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
          aria-label="Crear nuevo personal"
        >
          <Plus className="h-4 w-4" />
        </InputGroupButton>

        {selectedStaff && (
          <InputGroupButton
            variant="ghost"
            onClick={() => setEditOpen(true)}
            disabled={disabled}
            aria-label="Editar personal seleccionado"
          >
            <Edit className="h-4 w-4" />
          </InputGroupButton>
        )}
      </InputGroup>
    </>
  )
}
