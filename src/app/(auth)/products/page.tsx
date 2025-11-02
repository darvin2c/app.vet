import { ProductCategorySelect } from '@/components/product-categories/product-category-select'
import { ProductCreateButton } from '@/components/products/product-create-button'
import { ProductList } from '@/components/products/product-list'
import { ButtonGroup } from '@/components/ui/button-group'
import { SearchInput } from '@/components/ui/search-input'
import { OrderByConfig } from '@/components/ui/order-by/order-by.types'
import { FilterConfig } from '@/types/filters.types'
import { OrderBy } from '@/components/ui/order-by'
import { Filters } from '@/components/ui/filters'
import PageBase from '@/components/page-base'
import { ProductImportButton } from '@/components/products/product-import-button'

export default function ProductsPage() {
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
      key: 'category_id',
      field: 'category_id',
      type: 'custom',
      label: 'Categoría',
      operator: 'eq',
      component: <ProductCategorySelect placeholder="Selecciona categoría" />,
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
      { field: 'name', label: 'Nombre', sortable: true },
      { field: 'sku', label: 'SKU', sortable: true },
      { field: 'category_id', label: 'Categoría', sortable: true },
      { field: 'unit_id', label: 'Unidad', sortable: true },
      { field: 'is_active', label: 'Estado', sortable: true },
    ],
  }

  return (
    <PageBase
      title="Productos"
      subtitle="Gestiona el catálogo de productos"
      search={
        <SearchInput
          hasSidebarTriggerLeft
          placeholder="Buscar producto"
          size="lg"
          suffix={
            <ButtonGroup>
              <Filters filters={filters} />
              <OrderBy config={orderByConfig} />
              <ProductCreateButton variant={'ghost'} />
              <ProductImportButton variant={'ghost'} />
            </ButtonGroup>
          }
        />
      }
    >
      <ProductList filterConfig={filters} orderByConfig={orderByConfig} />
    </PageBase>
  )
}
