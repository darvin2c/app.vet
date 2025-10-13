'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown, X, Package, Plus, Edit } from 'lucide-react'
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
import useProducts from '@/hooks/products/use-products-list'
import { Tables } from '@/types/supabase.types'
import { ProductCreate } from './product-create'
import { ProductEdit } from './product-edit'

type Product = Tables<'products'>

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
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const { data: products = [], isLoading } = useProducts({
    filters: [
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
    ],
  })

  const selectedProduct = products.find((product: Product) => product.id === value)

  const handleSelect = (productId: string) => {
    onValueChange?.(productId)
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
              {selectedProduct ? (
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <div className="flex items-center gap-1">
                    <span>{selectedProduct.name}</span>
                    {selectedProduct.sku && (
                      <span className="text-xs text-muted-foreground">
                        ({selectedProduct.sku})
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
                placeholder="Buscar producto..."
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              <CommandEmpty>
                {isLoading ? 'Cargando...' : 'No se encontraron productos.'}
              </CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {products.map((product: Product) => (
                  <CommandItem
                    key={product.id}
                    value={product.name}
                    onSelect={() => handleSelect(product.id)}
                  >
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="font-medium">{product.name}</span>
                        {product.sku && (
                          <span className="text-sm text-muted-foreground">
                            SKU: {product.sku}
                          </span>
                        )}
                      </div>
                      {product.stock !== undefined && (
                        <div className="ml-auto text-sm text-muted-foreground">
                          Stock: {product.stock}
                        </div>
                      )}
                    </div>
                    <Check
                      className={cn(
                        'h-4 w-4',
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
            className="h-full"
          >
            <X className="h-4 w-4" />
          </InputGroupButton>
        )}

        <InputGroupButton
          variant="ghost"
          onClick={() => setCreateOpen(true)}
          disabled={disabled}
          aria-label="Crear nuevo producto"
          className="h-full"
        >
          <Plus className="h-4 w-4" />
        </InputGroupButton>

        {selectedProduct && (
          <InputGroupButton
            variant="ghost"
            onClick={() => setEditOpen(true)}
            disabled={disabled}
            aria-label="Editar producto seleccionado"
            className="h-full"
          >
            <Edit className="h-4 w-4" />
          </InputGroupButton>
        )}
      </InputGroup>

      <ProductCreate 
        open={createOpen} 
        onOpenChange={setCreateOpen}
      />

      {selectedProduct && (
        <ProductEdit
          open={editOpen}
          onOpenChange={setEditOpen}
          product={selectedProduct}
        />
      )}
    </>
  )
}
