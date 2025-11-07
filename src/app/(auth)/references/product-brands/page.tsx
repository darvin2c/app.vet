import type { Metadata } from 'next'
import PageBase from '@/components/page-base'
import { ProductBrandList } from '@/components/product-brands/product-brand-list'
import { ProductBrandCreateButton } from '@/components/product-brands/product-brand-create-button'
import { SearchInput } from '@/components/ui/search-input'
import { ButtonGroup } from '@/components/ui/button-group'
import { Filters } from '@/components/ui/filters'
import { OrderBy } from '@/components/ui/order-by'
import type { FilterConfig } from '@/components/ui/filters'
import type { OrderByConfig } from '@/components/ui/order-by'
import { ProductBrandImportButton } from '@/components/product-brands/product-brand-import-button'

export default function ProductBrandsPage() {
  const filters: FilterConfig[] = [
    {
      key: 'is_active',
      field: 'is_active',
      label: 'Estado',
      type: 'boolean',
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
    <PageBase
      title="Marcas de Productos"
      subtitle="Gestiona las marcas de productos disponibles"
      search={
        <SearchInput
          hasSidebarTriggerLeft
          placeholder="Buscar marcas..."
          size="lg"
          suffix={
            <ButtonGroup>
              <Filters filters={filters} triggerProps={{ variant: 'ghost' }} />
              <OrderBy
                config={orderByConfig}
                triggerProps={{ variant: 'ghost' }}
              />
              <ProductBrandImportButton variant="ghost" />
              <ProductBrandCreateButton variant="ghost" />
            </ButtonGroup>
          }
        />
      }
    >
      <ProductBrandList filterConfig={filters} orderByConfig={orderByConfig} />
    </PageBase>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Marcas de Productos',
    description:
      'Administra y categoriza las marcas de productos disponibles para tu inventario.',
  }
}
