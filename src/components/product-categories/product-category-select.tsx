'use client'

import { useState } from 'react'
import { EntitySelect } from '@/components/ui/entity-select'
import useProductCategoryList from '@/hooks/product-categories/use-product-category-list'
import { ProductCategoryCreate } from './product-category-create'
import { ProductCategoryEdit } from './product-category-edit'
import { Tables } from '@/types/supabase.types'

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
  const [searchTerm, setSearchTerm] = useState('')

  const { data, isLoading } = useProductCategoryList({
    search: searchTerm,
    filters: [
      {
        field: 'is_active',
        operator: 'eq',
        value: true,
      },
    ],
  })
  const productCategories = data?.data || []

  return (
    <EntitySelect<ProductCategory>
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      className={className}
      placeholder={placeholder}
      items={productCategories}
      isPending={isLoading}
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
      renderCreate={(props) => <ProductCategoryCreate {...props} />}
      renderEdit={(props) => {
        const category = productCategories.find((c) => c.id === props.id)
        if (!category) return null
        return <ProductCategoryEdit {...props} category={category} />
      }}
      renderItem={(category) => (
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <span>{category.name}</span>
            {category.description && (
              <span className="text-xs text-muted-foreground">
                {category.description}
              </span>
            )}
          </div>
        </div>
      )}
      renderSelected={(category) => (
        <div className="flex items-center gap-2">
          <span>{category.name}</span>
        </div>
      )}
    />
  )
}
