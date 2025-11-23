'use client'

import { useState } from 'react'
import { Package, Check, ChevronsUpDown, Plus, X, Edit } from 'lucide-react'
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
import useProductUnitList from '@/hooks/product-units/use-product-unit-list'
import { ProductUnitCreate } from './product-unit-create'
import { ProductUnitEdit } from './product-unit-edit'
import { Tables } from '@/types/supabase.types'
import { Spinner } from '../ui/spinner'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '../ui/empty'

type ProductUnit = Tables<'product_units'>

interface ProductUnitSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function ProductUnitSelect({
  value,
  onValueChange,
  placeholder = 'Seleccionar unidad...',
  disabled = false,
  className,
}: ProductUnitSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const { data, isLoading } = useProductUnitList({
    search: searchTerm,
  })
  const productUnits = data?.data || []

  const selectedProductUnit = productUnits.find(
    (unit: ProductUnit) => unit.id === value
  )

  const handleSelect = (unitId: string) => {
    onValueChange?.(unitId)
    setOpen(false)
  }

  const handleProductUnitCreated = (newUnit: ProductUnit) => {
    onValueChange?.(newUnit.id)
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
              {selectedProductUnit ? (
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span>{selectedProductUnit.name}</span>
                    {selectedProductUnit.abbreviation && (
                      <span className="text-xs text-muted-foreground">
                        {selectedProductUnit.abbreviation}
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
                placeholder="Buscar unidad..."
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
                            <Package className="w-10 h-10 text-muted-foreground" />
                          </EmptyMedia>
                          <EmptyTitle>No se encontraron unidades</EmptyTitle>
                        </EmptyHeader>
                      </Empty>
                    </>
                  }
                </CommandEmpty>
                <CommandGroup className="max-h-64 overflow-auto">
                  {productUnits.map((unit: ProductUnit) => (
                    <CommandItem
                      key={unit.id}
                      value={unit.name}
                      onSelect={() => handleSelect(unit.id)}
                    >
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span>
                            {unit.name} ({unit.abbreviation})
                          </span>
                        </div>
                      </div>
                      <Check
                        className={cn(
                          'h-4 w-4',
                          value === unit.id ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {selectedProductUnit && (
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
          aria-label="Crear nueva unidad"
          className="h-full"
        >
          <Plus className="h-4 w-4" />
        </InputGroupButton>

        {selectedProductUnit && (
          <InputGroupButton
            variant="ghost"
            onClick={() => setEditOpen(true)}
            disabled={disabled}
            aria-label="Editar unidad seleccionada"
            className="h-full"
          >
            <Edit className="h-4 w-4" />
          </InputGroupButton>
        )}
      </InputGroup>

      <ProductUnitCreate
        open={createOpen}
        onOpenChange={setCreateOpen}
        onUnitCreated={handleProductUnitCreated}
      />

      {selectedProductUnit && (
        <ProductUnitEdit
          unit={selectedProductUnit}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      )}
    </>
  )
}
