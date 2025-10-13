'use client'

import { useState } from 'react'
import { User, Check, ChevronsUpDown, Plus, X, Edit } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import useCustomerList from '@/hooks/customers/use-customer-list'
import { CustomerCreate } from './customer-create'
import { CustomerEdit } from './customer-edit'
import { Tables } from '@/types/supabase.types'

type Customer = Tables<'customers'>

interface CustomerSelectProps {
  value?: string
  onValueChange?: (value: string) => void
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
  const [searchTerm, setSearchTerm] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const { data: customers = [], isLoading } = useCustomerList({
    search: searchTerm,
    filters: [],
    orders: [],
  })

  const selectedCustomer = customers.find((customer: Customer) => customer.id === value)

  const handleSelect = (customerId: string) => {
    if (!onValueChange) return
    onValueChange(value === customerId ? '' : customerId)
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
              {selectedCustomer ? (
                <div className="flex items-center gap-2">
                  <Avatar className="h-4 w-4">
                    <AvatarImage src={''} />
                    <AvatarFallback className="text-xs">
                      {selectedCustomer.first_name?.[0]}
                      {selectedCustomer.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span>
                    {selectedCustomer.first_name} {selectedCustomer.last_name}
                  </span>
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
                placeholder="Buscar cliente..."
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              <CommandEmpty>
                {isLoading ? 'Cargando...' : 'No se encontraron clientes.'}
              </CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {customers.map((customer: Customer) => (
                  <CommandItem
                    key={customer.id}
                    value={`${customer.first_name} ${customer.last_name}`}
                    onSelect={() => handleSelect(customer.id)}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-4 w-4">
                        <AvatarImage src={''} />
                        <AvatarFallback className="text-xs">
                          {customer.first_name?.[0]}
                          {customer.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span>
                          {customer.first_name} {customer.last_name}
                        </span>
                        {customer.email && (
                          <span className="text-sm text-muted-foreground">
                            {customer.email}
                          </span>
                        )}
                      </div>
                    </div>
                    <Check
                      className={cn(
                        'h-4 w-4',
                        value === customer.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        {selectedCustomer && (
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
          aria-label="Crear nuevo cliente"
          className="h-full"
        >
          <Plus className="h-4 w-4" />
        </InputGroupButton>

        {selectedCustomer && (
          <InputGroupButton
            variant="ghost"
            onClick={() => setEditOpen(true)}
            disabled={disabled}
            aria-label="Editar cliente seleccionado"
            className="h-full"
          >
            <Edit className="h-4 w-4" />
          </InputGroupButton>
        )}
      </InputGroup>

      <CustomerCreate 
        open={createOpen} 
        onOpenChange={setCreateOpen}
      />

      {selectedCustomer && (
        <CustomerEdit
          open={editOpen}
          onOpenChange={setEditOpen}
          customerId={selectedCustomer.id}
        />
      )}
    </>
  )
}