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
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import useProducts from '@/hooks/products/use-products-list'
import { Database } from '@/types/supabase.types'

type Product = Database['public']['Tables']['products']['Row']

interface ProductSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function ProductSelect({
  value,
  onValueChange,
  placeholder = 'Seleccionar producto...',
  disabled = false,
  className,
}: ProductSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { data: products = [], isLoading } = useProducts([
    {
      field: 'search',
      operator: 'ilike',
      value: searchTerm,
    },
    {
      field: 'is_active',
      operator: 'eq',
      value: true,
    },
  ])

  const selectedProduct = products.find((product) => product.id === value)

  const handleSelect = (productId: string) => {
    if (!onValueChange) return
    onValueChange(value === productId ? '' : productId)
    setOpen(false)
  }

  return (
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
            {selectedProduct ? (
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-muted-foreground" />
                <span>{selectedProduct.name}</span>
                {selectedProduct.sku && (
                  <span className="text-xs text-muted-foreground">
                    ({selectedProduct.sku})
                  </span>
                )}
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
              placeholder="Buscar producto..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandEmpty>
              {isLoading ? 'Cargando...' : 'No se encontraron productos.'}
            </CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {products.map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.name}
                  onSelect={() => handleSelect(product.id)}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span>{product.name}</span>
                      {product.sku && (
                        <span className="text-xs text-muted-foreground">
                          SKU: {product.sku}
                        </span>
                      )}
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground">
                      Stock: {product.stock || 0}
                    </div>
                  </div>
                  <Check
                    className={cn(
                      'h-4 w-4 ml-2',
                      value === product.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedProduct && (
        <InputGroupButton
          variant="ghost"
          onClick={() => onValueChange?.('')}
          disabled={disabled}
          aria-label="Limpiar selección"
        >
          <X className="h-4 w-4" />
        </InputGroupButton>
      )}
    </InputGroup>
  )
}
