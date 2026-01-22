'use client'

import { EntitySelect } from '@/components/ui/entity-select'
import useProductUnitList from '@/hooks/product-units/use-product-unit-list'
import { Tables } from '@/types/supabase.types'
import { ProductUnitCreate } from './product-unit-create'
import { ProductUnitEdit } from './product-unit-edit'
import { useState } from 'react'

type ProductUnit = Tables<'product_units'>

interface ProductUnitSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function ProductUnitSelect({
  value,
  onValueChange,
  placeholder = 'Seleccionar unidad...',
  disabled = false,
  className,
}: ProductUnitSelectProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const { data, isLoading } = useProductUnitList({
    search: searchTerm,
  })
  const productUnits = data?.data || []

  return (
    <EntitySelect<ProductUnit>
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      className={className}
      placeholder={placeholder}
      items={productUnits}
      isPending={isLoading}
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
      renderCreate={(props) => (
        <ProductUnitCreate
          {...props}
          onUnitCreated={(newUnit) => {
            props.onSuccess(newUnit.id)
          }}
        />
      )}
      renderEdit={(props) => {
        const unit = productUnits.find((u) => u.id === props.id)
        if (!unit) return null
        return <ProductUnitEdit {...props} unit={unit} />
      }}
      renderItem={(unit) => (
        <div className="flex items-center gap-2">
          <div className="flex gap-2 items-center">
            <span>{unit.name}</span>
            {unit.abbreviation && (
              <span className="text-xs text-muted-foreground">
                ({unit.abbreviation})
              </span>
            )}
          </div>
        </div>
      )}
      renderSelected={(unit) => (
        <div className="flex items-center gap-2">
          <div className="flex gap-2 items-center">
            <span>{unit.name}</span>
            {unit.abbreviation && (
              <span className="text-xs text-muted-foreground">
                ({unit.abbreviation})
              </span>
            )}
          </div>
        </div>
      )}
    />
  )
}
