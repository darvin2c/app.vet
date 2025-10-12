import { ProductList } from '@/components/products/product-list'
import { ProductCreateButton } from '@/components/products/product-create-button'
import { SearchInput } from '@/components/ui/search-input'
import PageBase from '@/components/page-base'
import { Filters } from '@/components/ui/filters'
import { ButtonGroup } from '@/components/ui/button-group'
import { FilterConfig } from '@/types/filters.types'
import { OrderBy } from '@/components/ui/order-by'
import { OrderByConfig } from '@/types/order-by.types'

export default function ProductsPage() {
  // Configuración de filtros
  const filters: FilterConfig[] = [
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
  ]

  const orderByConfig: OrderByConfig = {
    columns: [
      {
        field: 'created_at',
        label: 'Fecha de creación',
      },
    ],
  }

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
              <Filters filters={filters} />
              <OrderBy config={orderByConfig} />
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
