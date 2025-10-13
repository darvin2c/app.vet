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
import useCustomerList from '@/hooks/customers/use-customer-list'
import { Tables } from '@/types/supabase.types'

type Customer = Tables<'customers'>

interface CustomerSelectProps {
  value?: string
  onValueChange: (value: string | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function CustomerSelect({
  value,
  onValueChange,
  placeholder = 'Seleccionar cliente...',
  disabled = false,
  className,
}: CustomerSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const { data: customers = [], isLoading } = useCustomerList({
    filters: {
      search: search || undefined,
      is_active: true,
    },
  })

  const selectedCustomer = customers.find((customer) => customer.id === value)

  const handleSelect = (customerId: string) => {
    if (customerId === value) {
      onValueChange(undefined)
    } else {
      onValueChange(customerId)
    }
    setOpen(false)
  }

  const getCustomerInitials = (customer: Customer) => {
    const fullName = `${customer.first_name} ${customer.last_name}`
    return fullName
      .split(' ')
      .map((name) => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getCustomerDisplayName = (customer: Customer) => {
    return `${customer.first_name} ${customer.last_name}`
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
          {selectedCustomer ? (
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {getCustomerInitials(selectedCustomer)}
                </AvatarFallback>
              </Avatar>
              <span className="truncate">
                {getCustomerDisplayName(selectedCustomer)}
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
              {isLoading
                ? 'Cargando clientes...'
                : 'No se encontraron clientes.'}
            </CommandEmpty>
            <CommandGroup>
              {customers.map((customer) => (
                <CommandItem
                  key={customer.id}
                  value={customer.id}
                  onSelect={() => handleSelect(customer.id)}
                  className="flex items-center space-x-2"
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === customer.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {getCustomerInitials(customer)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {getCustomerDisplayName(customer)}
                    </div>
                    {customer.email && (
                      <div className="text-sm text-muted-foreground truncate">
                        {customer.email}
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