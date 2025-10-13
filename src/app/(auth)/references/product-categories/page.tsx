'use client'

import PageBase from '@/components/page-base'
import { ProductCategoryList } from '@/components/product-categories/product-category-list'
import { ProductCategoryCreateButton } from '@/components/product-categories/product-category-create-button'
import { SearchInput } from '@/components/ui/search-input'
import { Filters } from '@/components/ui/filters'
import { ButtonGroup } from '@/components/ui/button-group'
import { FilterConfig } from '@/types/filters.types'
import { OrderBy } from '@/components/ui/order-by'
import { OrderByConfig } from '@/types/order-by.types'

export default function ProductCategoriesPage() {
  // Configuración de filtros
  const filters: FilterConfig[] = [
    {
      key: 'is_active',
      field: 'is_active',
      type: 'boolean',
      label: 'Estado',
      placeholder: 'Selecciona estado',
      operator: 'eq',
    },
    {
      key: 'created_range',
      field: 'created_at',
      type: 'dateRange',
      label: 'Fecha de creación',
      placeholder: 'Selecciona rango de fechas',
      operator: 'gte',
    },
  ]

  const orderByConfig: OrderByConfig = {
    columns: [
      { field: 'name', label: 'Nombre', sortable: true },
      { field: 'description', label: 'Descripción', sortable: true },
      { field: 'is_active', label: 'Estado', sortable: true },
      { field: 'created_at', label: 'Fecha de creación', sortable: true },
    ],
  }

  return (
    <PageBase
      title="Categorías de Productos"
      subtitle="Organiza productos en categorías para mejor gestión"
      search={
        <SearchInput
          hasSidebarTriggerLeft
          hasSidebarTriggerRight
          placeholder="Buscar categoría"
          size="lg"
          suffix={
            <ButtonGroup>
              <Filters filters={filters} />
              <OrderBy config={orderByConfig} />
              <ProductCategoryCreateButton />
            </ButtonGroup>
          }
        />
      }
    >
      <ProductCategoryList
        filterConfig={filters}
        orderByConfig={orderByConfig}
      />
    </PageBase>
  )
}
