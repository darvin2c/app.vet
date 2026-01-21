'use client'

import { useState } from 'react'
import { Tag } from 'lucide-react'
import { EntitySelect } from '@/components/ui/entity-select'
import useProductBrandList from '@/hooks/product-brands/use-product-brand-list'
import { ProductBrandCreate } from './product-brand-create'
import { ProductBrandEdit } from './product-brand-edit'
import { Tables } from '@/types/supabase.types'

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
  const [searchTerm, setSearchTerm] = useState('')

  const { data: brands = [], isLoading } = useProductBrandList({
    search: searchTerm,
  })

  return (
    <EntitySelect<ProductBrand>
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      className={className}
      placeholder={placeholder}
      items={brands}
      isPending={isLoading}
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
      renderCreate={(props) => <ProductBrandCreate {...props} />}
      renderEdit={(props) => {
        const brand = brands.find((b) => b.id === props.id)
        if (!brand) return null
        return <ProductBrandEdit {...props} brand={brand} />
      }}
      renderItem={(brand) => (
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <span>{brand.name}</span>
            {brand.description && (
              <span className="text-sm text-muted-foreground">
                {brand.description}
              </span>
            )}
          </div>
        </div>
      )}
      renderSelected={(brand) => (
        <div className="flex gap-2">
          <span>{brand.name}</span>
        </div>
      )}
    />
  )
}
