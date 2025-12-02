'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown, UserCheck, X, Plus, Edit } from 'lucide-react'
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
import { usePagination } from '../ui/pagination'
import { Spinner } from '../ui/spinner'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '../ui/empty'

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
  const { appliedPagination } = usePagination()

  const { data, isLoading } = useStaff({
    search: searchTerm,
    pagination: appliedPagination,
  })
  const staff = data?.data || []

  const selectedStaff = staff.find((member: Staff) => member.id === value)

  const getStaffFullName = (member: Staff) => {
    return `${member.first_name} ${member.last_name}`
  }

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
                  <span>{getStaffFullName(selectedStaff)}</span>
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
              <CommandList>
                <CommandEmpty>
                  {isLoading ? (
                    <div className="min-h-[100px]">
                      <Spinner />
                    </div>
                  ) : (
                    <>
                      <Empty>
                        <EmptyHeader>
                          <EmptyMedia>
                            <UserCheck className="w-10 h-10 text-muted-foreground" />
                          </EmptyMedia>
                          <EmptyTitle>No se encontró personal</EmptyTitle>
                        </EmptyHeader>
                      </Empty>
                    </>
                  )}
                </CommandEmpty>
                <CommandGroup className="max-h-64 overflow-auto">
                  {staff.map((member: Staff) => (
                    <CommandItem
                      key={member.id}
                      value={getStaffFullName(member)}
                      onSelect={() => handleSelect(member.id)}
                    >
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {getStaffFullName(member)}
                          </span>
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

      <StaffCreate open={createOpen} onOpenChange={setCreateOpen} />

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
