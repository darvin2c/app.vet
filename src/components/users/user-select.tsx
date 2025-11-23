'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown, X, User } from 'lucide-react'
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
import { useUserList, UserWithRole } from '@/hooks/users/use-user-list'
import { Spinner } from '../ui/spinner'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '../ui/empty'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

interface UserSelectProps {
  value?: string
  onValueChange?: (value: string) => void
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

  const { data, isLoading } = useUserList({
    search: searchTerm,
  })

  const users = data?.data || []

  const selectedUser = users.find((user: UserWithRole) => user.id === value)

  const handleSelect = (userId: string) => {
    onValueChange?.(userId)
    setOpen(false)
  }

  const handleClear = () => {
    onValueChange?.('')
  }

  return (
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
                <User className="w-4 h-4 text-muted-foreground" />
                <div className="flex items-center gap-1">
                  <span>
                    {selectedUser.first_name} {selectedUser.last_name}
                  </span>
                  {selectedUser.email && (
                    <span className="text-xs text-muted-foreground">
                      ({selectedUser.email})
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
            <CommandList>
              <CommandEmpty>
                {isLoading ? <div className="min-h-[100px]"><Spinner /></div> :
                  <>
                    <Empty>
                      <EmptyHeader>
                        <EmptyMedia>
                          <User className="w-10 h-10 text-muted-foreground" />
                        </EmptyMedia>
                        <EmptyTitle>No se encontraron usuarios</EmptyTitle>
                      </EmptyHeader>
                    </Empty>
                  </>
                }
              </CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {users.map((user: UserWithRole) => (
                  <CommandItem
                    key={user.id}
                    value={`${user.first_name} ${user.last_name}`}
                    onSelect={() => handleSelect(user.id)}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-4 w-4">
                        <AvatarImage src={''} />
                        <AvatarFallback className="text-xs">
                          {user.first_name?.[0]}
                          {user.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span>
                          {user.first_name} {user.last_name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {user.email}
                        </span>
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
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedUser && (
        <InputGroupButton
          variant="ghost"
          onClick={handleClear}
          disabled={disabled}
          aria-label="Limpiar selección"
          className="h-full"
        >
          <X className="h-4 w-4" />
        </InputGroupButton>
      )}
    </InputGroup>
  )
}
