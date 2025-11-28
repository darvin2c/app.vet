'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown, Plus, X, Edit, Tag } from 'lucide-react'
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
import useProductCategoryList from '@/hooks/product-categories/use-product-category-list'
import { ProductCategoryCreate } from './product-category-create'
import { ProductCategoryEdit } from './product-category-edit'
import { Tables } from '@/types/supabase.types'
import { usePagination } from '../ui/pagination'
import { Spinner } from '../ui/spinner'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '../ui/empty'

type ProductCategory = Tables<'product_categories'>

interface ProductCategorySelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function ProductCategorySelect({
  value,
  onValueChange,
  placeholder = 'Seleccionar categoría...',
  disabled = false,
  className,
}: ProductCategorySelectProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const { appliedPagination } = usePagination()
  const { data, isLoading } = useProductCategoryList({
    search: searchTerm,
    filters: [
      {
        field: 'is_active',
        operator: 'eq',
        value: true,
      },
    ],
    pagination: appliedPagination,
  })
  const categories = data?.data || []

  const selectedCategory = categories.find(
    (category: ProductCategory) => category.id === value
  )

  const handleSelect = (categoryId: string) => {
    if (!onValueChange) return
    onValueChange(value === categoryId ? '' : categoryId)
    setOpen(false)
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
              className="flex-1 justify-between h-full px-3 py-2 text-left font-normal"
              disabled={disabled}
            >
              {selectedCategory ? (
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedCategory.name}</span>
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
                placeholder="Buscar categoría..."
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
                          <EmptyTitle>No se encontraron categorías</EmptyTitle>
                        </EmptyHeader>
                      </Empty>
                    </>
                  }
                </CommandEmpty>
                <CommandGroup className="max-h-64 overflow-auto">
                  {categories.map((category: ProductCategory) => (
                    <CommandItem
                      key={category.id}
                      value={category.name}
                      onSelect={() => handleSelect(category.id)}
                    >
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span>{category.name}</span>
                          {category.description && (
                            <span className="text-sm text-muted-foreground">
                              {category.description}
                            </span>
                          )}
                        </div>
                      </div>
                      <Check
                        className={cn(
                          'h-4 w-4',
                          value === category.id ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {selectedCategory && (
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
          aria-label="Crear nueva categoría"
          className="h-full"
        >
          <Plus className="h-4 w-4" />
        </InputGroupButton>

        {selectedCategory && (
          <InputGroupButton
            variant="ghost"
            onClick={() => setEditOpen(true)}
            disabled={disabled}
            aria-label="Editar categoría seleccionada"
            className="h-full"
          >
            <Edit className="h-4 w-4" />
          </InputGroupButton>
        )}
      </InputGroup>

      <ProductCategoryCreate open={createOpen} onOpenChange={setCreateOpen} />

      {selectedCategory && (
        <ProductCategoryEdit
          open={editOpen}
          onOpenChange={setEditOpen}
          category={selectedCategory}
        />
      )}
    </>
  )
}
