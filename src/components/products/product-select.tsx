'use client'

import { EntitySelect } from '@/components/ui/entity-select'
import useProductList, { Product } from '@/hooks/products/use-products-list'
import { ProductCreate } from './product-create'
import { ProductEdit } from './product-edit'
import { useState } from 'react'

interface ProductSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  className?: string
  placeholder?: string
}

export function ProductSelect({
  value,
  onValueChange,
  disabled,
  className,
  placeholder = 'Seleccionar producto...',
}: ProductSelectProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const { data, isLoading } = useProductList({
    search: searchTerm,
  })
  const products = data?.data || []

  return (
    <EntitySelect<Product>
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      className={className}
      placeholder={placeholder}
      items={products}
      isPending={isLoading}
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
      renderCreate={(props) => <ProductCreate {...props} />}
      renderEdit={(props) => {
        if (!props.id) return null
        return <ProductEdit {...props} productId={props.id} />
      }}
      renderItem={(product) => (
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <span className="text-sm">{product.name}</span>
            {product.sku && (
              <span className="text-xs text-muted-foreground">
                SKU: {product.sku}
              </span>
            )}
          </div>
        </div>
      )}
      renderSelected={(product) => (
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <span>{product.name}</span>
            {product.sku && (
              <span className="text-xs text-muted-foreground">
                ({product.sku})
              </span>
            )}
          </div>
        </div>
      )}
    />
  )
}
