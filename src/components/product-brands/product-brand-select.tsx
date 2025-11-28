'use client'

import { useState } from 'react'
import { Tag, Check, ChevronsUpDown, Plus, X, Edit } from 'lucide-react'
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
import useProductBrandList from '@/hooks/product-brands/use-product-brand-list'
import { ProductBrandCreate } from './product-brand-create'
import { ProductBrandEdit } from './product-brand-edit'
import { Tables } from '@/types/supabase.types'
import { Spinner } from '../ui/spinner'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '../ui/empty'

type ProductBrand = Tables<'product_brands'>

interface ProductBrandSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function ProductBrandSelect({
  value,
  onValueChange,
  placeholder = 'Seleccionar marca...',
  disabled = false,
  className,
}: ProductBrandSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const { data: brands = [], isLoading } = useProductBrandList({
    search: searchTerm,
  })

  const selectedBrand = brands.find((brand: ProductBrand) => brand.id === value)

  const handleSelect = (brandId: string) => {
    if (!onValueChange) return
    onValueChange(value === brandId ? '' : brandId)
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
              {selectedBrand ? (
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedBrand.name}</span>
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
                placeholder="Buscar marca..."
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
                            <Tag className="w-10 h-10 text-muted-foreground" />
                          </EmptyMedia>
                          <EmptyTitle>No se encontraron marcas</EmptyTitle>
                        </EmptyHeader>
                      </Empty>
                    </>
                  }
                </CommandEmpty>
                <CommandGroup className="max-h-64 overflow-auto">
                  {brands.map((brand: ProductBrand) => (
                    <CommandItem
                      key={brand.id}
                      value={brand.name}
                      onSelect={() => handleSelect(brand.id)}
                    >
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span>{brand.name}</span>
                          {brand.description && (
                            <span className="text-sm text-muted-foreground">
                              {brand.description}
                            </span>
                          )}
                        </div>
                      </div>
                      <Check
                        className={cn(
                          'h-4 w-4',
                          value === brand.id ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {selectedBrand && (
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
          aria-label="Crear nueva marca"
          className="h-full"
        >
          <Plus className="h-4 w-4" />
        </InputGroupButton>

        {selectedBrand && (
          <InputGroupButton
            variant="ghost"
            onClick={() => setEditOpen(true)}
            disabled={disabled}
            aria-label="Editar marca seleccionada"
            className="h-full"
          >
            <Edit className="h-4 w-4" />
          </InputGroupButton>
        )}
      </InputGroup>

      <ProductBrandCreate open={createOpen} onOpenChange={setCreateOpen} />

      {selectedBrand && (
        <ProductBrandEdit
          open={editOpen}
          onOpenChange={setEditOpen}
          brand={selectedBrand}
        />
      )}
    </>
  )
}
