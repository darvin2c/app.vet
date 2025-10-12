'use client'

import { useState, useEffect } from 'react'
import { Check, ChevronsUpDown, Search, User } from 'lucide-react'
import { cn } from '@/lib/utils'
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import useClientList from '@/hooks/clients/use-client-list'
import { Tables } from '@/types/supabase.types'

type Client = Tables<'clients'>

interface ClientSelectProps {
  value?: string
  onValueChange: (value: string | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function ClientSelect({
  value,
  onValueChange,
  placeholder = 'Seleccionar cliente...',
  disabled = false,
  className,
}: ClientSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  
  const { data: clients = [], isLoading } = useClientList({
    filters: {
      search: search || undefined,
      is_active: true,
    },
  })

  const selectedClient = clients.find((client) => client.id === value)

  const handleSelect = (clientId: string) => {
    if (clientId === value) {
      onValueChange(undefined)
    } else {
      onValueChange(clientId)
    }
    setOpen(false)
  }

  const getClientInitials = (client: Client) => {
    return `${client.first_name?.[0] || ''}${client.last_name?.[0] || ''}`.toUpperCase()
  }

  const getClientDisplayName = (client: Client) => {
    return `${client.first_name} ${client.last_name}`
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
          disabled={disabled}
        >
          {selectedClient ? (
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {getClientInitials(selectedClient)}
                </AvatarFallback>
              </Avatar>
              <span className="truncate">
                {getClientDisplayName(selectedClient)}
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{placeholder}</span>
            </div>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Buscar cliente..."
              value={search}
              onValueChange={setSearch}
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <CommandList>
            <CommandEmpty>
              {isLoading ? 'Cargando clientes...' : 'No se encontraron clientes.'}
            </CommandEmpty>
            <CommandGroup>
              {clients.map((client) => (
                <CommandItem
                  key={client.id}
                  value={client.id}
                  onSelect={() => handleSelect(client.id)}
                  className="flex items-center space-x-2"
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === client.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {getClientInitials(client)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {getClientDisplayName(client)}
                    </div>
                    {client.email && (
                      <div className="text-sm text-muted-foreground truncate">
                        {client.email}
                      </div>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}