'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown, Shield, X, Plus, Edit } from 'lucide-react'
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useRoleList } from '@/hooks/roles/use-role-list'
import { Tables } from '@/types/supabase.types'
import { RoleCreate } from './role-create'
import { RoleEdit } from './role-edit'
import { usePagination } from '../ui/pagination'
import { Spinner } from '../ui/spinner'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '../ui/empty'

type Role = Tables<'roles'>

interface RoleSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function RoleSelect({
  value,
  onValueChange,
  placeholder = 'Seleccionar rol...',
  disabled = false,
  className,
}: RoleSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const { appliedPagination } = usePagination()
  const { data, isLoading } = useRoleList({
    search: searchTerm,
    pagination: appliedPagination,
  })
  const roles = data?.data || []
  const selectedRole = roles.find((role) => role.id === value)

  const handleSelect = (roleId: string) => {
    if (!onValueChange) return
    onValueChange(value === roleId ? '' : roleId)
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
              {selectedRole ? (
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs bg-primary/10">
                      <Shield className="h-3 w-3" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start min-w-0 flex-1">
                    <span className="text-sm font-medium truncate">
                      {selectedRole.name}
                    </span>
                    {selectedRole.description && (
                      <span className="text-xs text-muted-foreground truncate">
                        {selectedRole.description}
                      </span>
                    )}
                  </div>
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
                placeholder="Buscar rol..."
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              <CommandList>
                <CommandEmpty>
                  {isLoading ? <div className="min-h-[100px]"><Spinner /></div> :
                    <>
                      <Empty>
                        <EmptyHeader>
                          <EmptyMedia>
                            <Shield className="w-10 h-10 text-muted-foreground" />
                          </EmptyMedia>
                          <EmptyTitle>No se encontraron roles</EmptyTitle>
                        </EmptyHeader>
                      </Empty>
                    </>
                  }
                </CommandEmpty>
                <CommandGroup className="max-h-64 overflow-auto">
                  {roles.map((role) => (
                    <CommandItem
                      key={role.id}
                      value={role.name}
                      onSelect={() => handleSelect(role.id)}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs bg-primary/10">
                            <Shield className="h-3 w-3" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start min-w-0 flex-1">
                          <span className="text-sm font-medium truncate">
                            {role.name}
                          </span>
                          {role.description && (
                            <span className="text-xs text-muted-foreground truncate">
                              {role.description}
                            </span>
                          )}
                        </div>
                      </div>
                      <Check
                        className={cn(
                          'h-4 w-4',
                          value === role.id ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {selectedRole && (
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
          aria-label="Crear nuevo rol"
          className="h-full"
        >
          <Plus className="h-4 w-4" />
        </InputGroupButton>

        {selectedRole && (
          <InputGroupButton
            variant="ghost"
            onClick={() => setEditOpen(true)}
            disabled={disabled}
            aria-label="Editar rol seleccionado"
            className="h-full"
          >
            <Edit className="h-4 w-4" />
          </InputGroupButton>
        )}
      </InputGroup>

      <RoleCreate open={createOpen} onOpenChange={setCreateOpen} />

      {selectedRole && (
        <RoleEdit
          open={editOpen}
          onOpenChange={setEditOpen}
          role={selectedRole}
        />
      )}
    </>
  )
}
