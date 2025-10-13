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
import useStaff from '@/hooks/staff/use-staff-list'
import { StaffCreate } from './staff-create'
import { StaffEdit } from './staff-edit'
import { Tables } from '@/types/supabase.types'
import { cn } from '@/lib/utils'

type Staff = Tables<'staff'>

interface StaffSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function StaffSelect({
  value,
  onValueChange,
  placeholder = 'Seleccionar personal...',
  disabled = false,
  className,
}: StaffSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const { data: staff = [], isLoading } = useStaff({
    search: searchTerm,
    is_active: true,
  })

  const selectedStaff = staff.find((member: Staff) => member.id === value)

  const handleSelect = (staffId: string) => {
    if (!onValueChange) return
    onValueChange(value === staffId ? '' : staffId)
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
              {selectedStaff ? (
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedStaff.full_name}</span>
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
                placeholder="Buscar personal..."
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              <CommandEmpty>
                {isLoading ? 'Cargando...' : 'No se encontró personal.'}
              </CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {staff.map((member: Staff) => (
                  <CommandItem
                    key={member.id}
                    value={member.full_name}
                    onSelect={() => handleSelect(member.id)}
                  >
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="font-medium">{member.full_name}</span>
                        {member.email && (
                          <span className="text-sm text-muted-foreground">
                            {member.email}
                          </span>
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
            </Command>
          </PopoverContent>
        </Popover>

        {selectedStaff && (
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
          aria-label="Crear personal"
          className="h-full"
        >
          <Plus className="h-4 w-4" />
        </InputGroupButton>

        {selectedStaff && (
          <InputGroupButton
            variant="ghost"
            onClick={() => setEditOpen(true)}
            disabled={disabled}
            aria-label="Editar personal"
            className="h-full"
          >
            <Edit className="h-4 w-4" />
          </InputGroupButton>
        )}
      </InputGroup>

      <StaffCreate
        open={createOpen}
        onOpenChange={setCreateOpen}
      />

      {selectedStaff && (
        <StaffEdit
          open={editOpen}
          onOpenChange={setEditOpen}
          staff={selectedStaff}
        />
      )}
    </>
  )
}
