'use client'

import { ProductList } from '@/components/products/product-list'
import { ProductCreateButton } from '@/components/products/product-create-button'
import { SearchInput } from '@/components/ui/search-input'
import PageBase from '@/components/page-base'
import { Filters } from '@/components/ui/filters'
import { ButtonGroup } from '@/components/ui/button-group'
import { useState, useCallback, useMemo } from 'react'
import { ProductFiltersSchema } from '@/schemas/products.schema'
import type { FiltersConfig, AppliedFilter } from '@/types/filters.types'

export default function ProductsPage() {
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([])
  const [filters, setFilters] = useState<ProductFiltersSchema>({})

  // Función para manejar cambios en los filtros
  const handleFiltersChange = useCallback((appliedFilters: AppliedFilter[]) => {
    const newFilters: ProductFiltersSchema = {}

    appliedFilters.forEach((filter) => {
      if (filter.field === 'search') {
        newFilters.search = filter.value
      } else if (filter.field === 'is_active') {
        newFilters.is_active = filter.value === 'true'
      } else if (filter.field === 'category_id') {
        newFilters.category_id = filter.value
      } else if (filter.field === 'unit_id') {
        newFilters.unit_id = filter.value
      } else if (filter.field === 'min_stock' && filter.operator === 'gte') {
        newFilters.min_stock_from = Number(filter.value)
      } else if (filter.field === 'min_stock' && filter.operator === 'lte') {
        newFilters.min_stock_to = Number(filter.value)
      } else if (filter.field === 'created_at' && filter.operator === 'gte') {
        newFilters.created_from = filter.value
      } else if (filter.field === 'created_at' && filter.operator === 'lte') {
        newFilters.created_to = filter.value
      }
    })

    setFilters(newFilters)
    setAppliedFilters(appliedFilters)
  }, [])

  // Configuración de filtros
  const filtersConfig: FiltersConfig = useMemo(
    () => ({
      filters: [
        {
          key: 'search',
          field: 'search',
          type: 'search',
          label: 'Buscar productos',
          placeholder: 'Buscar por nombre, SKU...',
          operator: 'ilike',
        },
        {
          key: 'is_active',
          field: 'is_active',
          type: 'boolean',
          label: 'Estado',
          placeholder: 'Selecciona estado',
          operator: 'eq',
        },
        {
          key: 'category_id',
          field: 'category_id',
          type: 'select',
          label: 'Categoría',
          placeholder: 'Selecciona categoría',
          operator: 'eq',
          options: [],
        },
        {
          key: 'unit_id',
          field: 'unit_id',
          type: 'select',
          label: 'Unidad',
          placeholder: 'Selecciona unidad',
          operator: 'eq',
          options: [],
        },
        {
          key: 'min_stock_range',
          field: 'min_stock',
          type: 'number',
          label: 'Stock mínimo',
          placeholder: 'Stock mínimo',
          operator: 'gte',
        },
        {
          key: 'created_range',
          field: 'created_at',
          type: 'dateRange',
          label: 'Fecha de creación',
          placeholder: 'Selecciona rango de fechas',
          operator: 'gte',
        },
      ],
      onFiltersChange: handleFiltersChange,
    }),
    [handleFiltersChange]
  )

  return (
    <PageBase
      title="Productos"
      subtitle="Gestiona el catálogo de productos de tu negocio"
      actions={<div className="flex items-center gap-2"></div>}
      search={
        <SearchInput
          hasSidebarTrigger
          placeholder="Buscar producto"
          size="lg"
          suffix={
            <ButtonGroup>
              <Filters {...filtersConfig} />
              <ProductCreateButton />
            </ButtonGroup>
          }
        />
      }
    >
      <ProductList filters={filters} />
    </PageBase>
  )
}
