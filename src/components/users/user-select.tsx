'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown, X, Package } from 'lucide-react'
import { cn } from '@/lib/utils'
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
import { Tables } from '@/types/supabase.types'
import useUserList from '@/hooks/users/use-user-list'

interface UserSelectProps {
  value?: string
  onValueChange?: (value?: string | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function UserSelect({
  value,
  onValueChange,
  placeholder = 'Seleccionar usuario...',
  disabled = false,
  className,
}: UserSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const { data: users = [], isLoading } = useUserList()
  console.log('users', users)
  const selectedUser = users.find(
    (user: Tables<'profiles'>) => user.id === value
  )

  const handleSelect = (userId: string) => {
    onValueChange?.(userId === '' ? null : userId)
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
              {selectedUser ? (
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <div className="flex items-center gap-1">
                    <span>{selectedUser?.first_name}</span>
                    {selectedUser?.last_name && (
                      <span className="text-xs text-muted-foreground">
                        ({selectedUser?.last_name})
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
                placeholder="Buscar usuario..."
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              <CommandEmpty>
                {isLoading ? 'Cargando...' : 'No se encontraron usuarios.'}
              </CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {users.map((user: Tables<'profiles'>) => (
                  <CommandItem
                    key={user.id}
                    value={user.id}
                    onSelect={() => handleSelect(user.id)}
                  >
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="font-medium">{user.first_name}</span>
                        {user.last_name && (
                          <span className="text-sm text-muted-foreground">
                            {user.last_name}
                          </span>
                        )}
                      </div>
                    </div>
                    <Check
                      className={cn(
                        'h-4 w-4',
                        value === user.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        {selectedUser && (
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
      </InputGroup>
    </>
  )
}
