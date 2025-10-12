'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown, Plus, X, Edit, Package } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
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
import { FormControl } from '@/components/ui/form'
import useProductUnits from '@/hooks/product-units/use-product-units'
import { ProductUnitCreate } from './product-unit-create'
import { ProductUnitEdit } from './product-unit-edit'
import { Tables } from '@/types/supabase.types'

interface ProductUnitSelectProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function ProductUnitSelect({
  value,
  onValueChange,
  placeholder = 'Seleccionar unidad...',
  disabled = false,
}: ProductUnitSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const { data: units = [], isLoading } = useProductUnits({
    filters: {
      search: searchTerm,
      is_active: true,
    },
  })

  const selectedUnit = units.find((unit) => unit.id === value)

  const handleSelect = (unitId: string) => {
    onValueChange(unitId === value ? '' : unitId)
    setOpen(false)
  }

  const handleUnitCreated = (newUnit: Tables<'product_units'>) => {
    onValueChange(newUnit.id)
    setCreateOpen(false)
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
              className="flex-1 justify-between h-9 px-3 py-2 text-left font-normal"
              disabled={disabled}
            >
              {selectedUnit ? (
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedUnit.name || selectedUnit.abbreviation}</span>
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
              <CommandEmpty>
                {isLoading ? 'Cargando...' : 'No se encontraron unidades.'}
              </CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {units.map((unit) => (
                  <CommandItem
                    key={unit.id}
                    value={unit.name || unit.abbreviation}
                    onSelect={() => handleSelect(unit.id)}
                  >
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <span>{unit.name || unit.abbreviation}</span>
                        {unit.name && unit.abbreviation && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({unit.abbreviation})
                          </span>
                        )}
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
            </Command>
          </PopoverContent>
        </Popover>

        {selectedUnit && (
          <InputGroupButton
            variant="ghost"
            onClick={() => onValueChange('')}
            disabled={disabled}
            aria-label="Limpiar selección"
          >
            <X className="h-4 w-4" />
          </InputGroupButton>
        )}

        <InputGroupButton
          variant="ghost"
          onClick={() => setCreateOpen(true)}
          disabled={disabled}
          aria-label="Crear nueva unidad"
        >
          <Plus className="h-4 w-4" />
        </InputGroupButton>

        {selectedUnit && (
          <InputGroupButton
            variant="ghost"
            onClick={() => setEditOpen(true)}
            disabled={disabled}
            aria-label="Editar unidad seleccionada"
          >
            <Edit className="h-4 w-4" />
          </InputGroupButton>
        )}
      </InputGroup>

      <ProductUnitCreate
        open={createOpen}
        onOpenChange={setCreateOpen}
        onUnitCreated={handleUnitCreated}
      />

      {selectedUnit && (
        <ProductUnitEdit
          open={editOpen}
          onOpenChange={setEditOpen}
          unit={selectedUnit}
        />
      )}
    </>
  )
}
