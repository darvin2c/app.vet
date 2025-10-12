'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import useProductBrandList from '@/hooks/product-brands/use-product-brand-list'
import { Tables } from '@/types/supabase.types'
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

type ProductBrand = Tables<'product_brands'>

interface ProductBrandSelectProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
}

export function ProductBrandSelect({
  value,
  onValueChange,
  placeholder = 'Seleccionar marca...',
}: ProductBrandSelectProps) {
  const [open, setOpen] = useState(false)
  const { data: brands, isLoading } = useProductBrandList({})

  const selectedBrand = brands?.find(
    (brand: ProductBrand) => brand.id === value
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedBrand ? selectedBrand.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Buscar marca..." />
          <CommandList>
            <CommandEmpty>
              {isLoading ? 'Cargando...' : 'No se encontraron marcas.'}
            </CommandEmpty>
            <CommandGroup>
              {brands?.map((brand: ProductBrand) => (
                <CommandItem
                  key={brand.id}
                  value={brand.id}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? '' : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === brand.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {brand.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
