'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
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
import useSuppliers from '@/hooks/suppliers/use-supplier-list'

interface SupplierSelectProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function SupplierSelect({
  value,
  onValueChange,
  placeholder = 'Seleccionar proveedor...',
  disabled = false,
}: SupplierSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const { data: suppliers, isLoading } = useSuppliers({
    search,
  })

  const selectedSupplier = suppliers?.find((supplier) => supplier.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedSupplier ? selectedSupplier.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Buscar proveedor..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? 'Cargando...' : 'No se encontraron proveedores.'}
            </CommandEmpty>
            <CommandGroup>
              {suppliers?.map((supplier) => (
                <CommandItem
                  key={supplier.id}
                  value={supplier.id}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? '' : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === supplier.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{supplier.name}</span>
                    {supplier.contact_person && (
                      <span className="text-sm text-muted-foreground">
                        {supplier.contact_person}
                      </span>
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
