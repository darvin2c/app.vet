'use client'

import { EntitySelect } from '@/components/ui/entity-select'
import useProductList from '@/hooks/products/use-products-list'
import { Tables } from '@/types/supabase.types'
import { ProductCreate } from './product-create'
import { ProductEdit } from './product-edit'
import { Package } from 'lucide-react'

type Product = Tables<'products'>

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
  const { products, isLoading, searchTerm, setSearchTerm } = useProductList()

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
      renderEdit={(props) => <ProductEdit {...props} />}
      renderItem={(product) => (
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
        </div>
      )}
      renderSelected={(product) => (
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="font-medium">{product.name}</span>
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
