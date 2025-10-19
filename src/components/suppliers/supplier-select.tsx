'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown, Building, X, Plus, Edit } from 'lucide-react'
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
import useSuppliers from '@/hooks/suppliers/use-supplier-list'
import { SupplierCreate } from './supplier-create'
import { SupplierEdit } from './supplier-edit'
import { Database } from '@/types/supabase.types'

type Supplier = Database['public']['Tables']['suppliers']['Row']

interface SupplierSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function SupplierSelect({
  value,
  onValueChange,
  placeholder = 'Seleccionar proveedor...',
  disabled = false,
  className,
}: SupplierSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const { data: suppliers = [], isLoading } = useSuppliers({
    search: searchTerm,
  })

  const selectedSupplier = suppliers.find(
    (supplier: Supplier) => supplier.id === value
  )

  const handleSelect = (supplierId: string) => {
    if (!onValueChange) return
    onValueChange(value === supplierId ? '' : supplierId)
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
              {selectedSupplier ? (
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedSupplier.name}</span>
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
                placeholder="Buscar proveedor..."
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              <CommandEmpty>
                {isLoading ? 'Cargando...' : 'No se encontraron proveedores.'}
              </CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {suppliers.map((supplier: Supplier) => (
                  <CommandItem
                    key={supplier.id}
                    value={supplier.name}
                    onSelect={() => handleSelect(supplier.id)}
                  >
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="font-medium">{supplier.name}</span>
                        {supplier.contact_person && (
                          <span className="text-sm text-muted-foreground">
                            {supplier.contact_person}
                          </span>
                        )}
                      </div>
                    </div>
                    <Check
                      className={cn(
                        'h-4 w-4',
                        value === supplier.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        {selectedSupplier && (
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
          aria-label="Crear proveedor"
          className="h-full"
        >
          <Plus className="h-4 w-4" />
        </InputGroupButton>

        {selectedSupplier && (
          <InputGroupButton
            variant="ghost"
            onClick={() => setEditOpen(true)}
            disabled={disabled}
            aria-label="Editar proveedor"
            className="h-full"
          >
            <Edit className="h-4 w-4" />
          </InputGroupButton>
        )}
      </InputGroup>

      <SupplierCreate open={createOpen} onOpenChange={setCreateOpen} />

      {selectedSupplier && (
        <SupplierEdit
          open={editOpen}
          onOpenChange={setEditOpen}
          supplier={selectedSupplier}
        />
      )}
    </>
  )
}
