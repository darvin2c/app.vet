import { ProductCategorySelect } from '@/components/product-categories/product-category-select'
import { ProductCreateButton } from '@/components/products/product-create-button'
import { ProductList } from '@/components/products/product-list'
import { SearchInput } from '@/components/ui/search-input'
import { OrderByConfig } from '@/components/ui/order-by'
import { FilterConfig } from '@/components/ui/filters'
import { OrderBy } from '@/components/ui/order-by'
import { Filters } from '@/components/ui/filters'
import PageBase from '@/components/page-base'
import { ProductImportButton } from '@/components/products/product-import-button'
import CanAccess from '@/components/ui/can-access'

export default function ProductsPage() {
  // Configuración de filtros
  const filters: FilterConfig[] = [
    {
      field: 'is_active',
      label: 'Estado',
      placeholder: 'Selecciona estado',
      operator: 'eq',
    },
    {
      field: 'category_id',
      label: 'Categoría',
      operator: 'eq',
      component: ProductCategorySelect,
    },
    {
      field: 'unit_id',
      label: 'Unidad',
      placeholder: 'Selecciona unidad',
      operator: 'eq',
      options: [],
    },
    {
      field: 'min_stock',
      label: 'Stock mínimo',
      placeholder: 'Stock mínimo',
      operator: 'gte',
    },
    {
      field: 'created_at',
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
    <CanAccess resource="products" action="read">
      <PageBase
        title="Productos"
        subtitle="Gestiona el catálogo de productos"
        search={
          <SearchInput
            placeholder="Buscar producto"
            suffix={
              <>
                <Filters
                  filters={filters}
                  triggerProps={{ variant: 'outline' }}
                />
                <OrderBy
                  config={orderByConfig}
                  triggerProps={{ variant: 'outline' }}
                />
              </>
            }
          />
        }
        actions={
          <>
            <ProductImportButton variant={'outline'} />
            <ProductCreateButton variant={'default'} />
          </>
        }
      >
        <ProductList filterConfig={filters} orderByConfig={orderByConfig} />
      </PageBase>
    </CanAccess>
  )
}
