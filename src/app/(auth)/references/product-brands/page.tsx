import type { Metadata } from 'next'
import PageBase from '@/components/page-base'
import { ProductBrandList } from '@/components/product-brands/product-brand-list'
import { ProductBrandCreateButton } from '@/components/product-brands/product-brand-create-button'
import { SearchInput } from '@/components/ui/search-input'
import { Filters } from '@/components/ui/filters'
import { OrderBy } from '@/components/ui/order-by'
import type { FilterConfig } from '@/components/ui/filters'
import type { OrderByConfig } from '@/components/ui/order-by'
import { ProductBrandImportButton } from '@/components/product-brands/product-brand-import-button'
import CanAccess from '@/components/ui/can-access'

export default function ProductBrandsPage() {
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
    <CanAccess resource="product_brands" action="read">
      <PageBase
        title="Marcas de Productos"
        subtitle="Gestiona las marcas de productos disponibles"
        search={
          <SearchInput
            placeholder="Buscar marcas..."
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
              </>
            }
          />
        }
        actions={
          <>
            <ProductBrandImportButton variant="outline" />
            <ProductBrandCreateButton variant="default" />
          </>
        }
      >
        <ProductBrandList
          filterConfig={filters}
          orderByConfig={orderByConfig}
        />
      </PageBase>
    </CanAccess>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Marcas de Productos',
    description:
      'Administra y categoriza las marcas de productos disponibles para tu inventario.',
  }
}
