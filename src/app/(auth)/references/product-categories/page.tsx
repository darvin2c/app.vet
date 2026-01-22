import type { Metadata } from 'next'
import PageBase from '@/components/page-base'
import { ProductCategoryList } from '@/components/product-categories/product-category-list'
import { ProductCategoryCreateButton } from '@/components/product-categories/product-category-create-button'
import { SearchInput } from '@/components/ui/search-input'
import { Filters } from '@/components/ui/filters'
import { OrderBy } from '@/components/ui/order-by'
import type { FilterConfig } from '@/components/ui/filters'
import type { OrderByConfig } from '@/components/ui/order-by'
import { ProductCategoryImportButton } from '@/components/product-categories/product-category-import-button'
import CanAccess from '@/components/ui/can-access'

export default function ProductCategoriesPage() {
  const filters: FilterConfig[] = [
    {
      field: 'is_active',
      label: 'Estado',
      operator: 'eq',
    },
  ]

  const orderByConfig: OrderByConfig = {
    columns: [
      { field: 'name', label: 'Nombre', sortable: true },
      { field: 'created_at', label: 'Fecha de Creación', sortable: true },
    ],
  }

  return (
    <CanAccess resource="product_categories" action="read">
      <PageBase
        title="Categorías de Productos"
        subtitle="Gestiona las categorías de productos disponibles"
        search={
          <SearchInput
            hasSidebarTriggerLeft
            hasSidebarTriggerRight
            placeholder="Buscar categorías..."
            size="lg"
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
                <ProductCategoryImportButton variant={'outline'} />
                <ProductCategoryCreateButton variant={'outline'} />
              </>
            }
          />
        }
      >
        <ProductCategoryList
          filterConfig={filters}
          orderByConfig={orderByConfig}
        />
      </PageBase>
    </CanAccess>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Categorías de Productos',
    description:
      'Organiza las categorías de productos para una gestión clara del inventario.',
  }
}
