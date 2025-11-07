import type { Metadata } from 'next'
import PageBase from '@/components/page-base'
import { ProductUnitList } from '@/components/product-units/product-unit-list'
import { ProductUnitCreateButton } from '@/components/product-units/product-unit-create-button'
import { SearchInput } from '@/components/ui/search-input'
import { ButtonGroup } from '@/components/ui/button-group'
import { Filters } from '@/components/ui/filters'
import { OrderBy } from '@/components/ui/order-by'
import type { FilterConfig } from '@/components/ui/filters'
import type { OrderByConfig } from '@/components/ui/order-by'

export default function ProductUnitsPage() {
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
      { field: 'symbol', label: 'Símbolo', sortable: true },
      { field: 'created_at', label: 'Fecha de Creación', sortable: true },
    ],
  }

  return (
    <PageBase
      title="Unidades de Productos"
      subtitle="Gestiona las unidades de medida para productos"
      search={
        <SearchInput
          hasSidebarTriggerLeft
          placeholder="Buscar unidades..."
          size="lg"
          suffix={
            <ButtonGroup>
              <Filters filters={filters} />
              <OrderBy config={orderByConfig} />
              <ProductUnitCreateButton />
            </ButtonGroup>
          }
        />
      }
    >
      <ProductUnitList filterConfig={filters} orderByConfig={orderByConfig} />
    </PageBase>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Unidades de Productos',
    description:
      'Define y gestiona las unidades de medida aplicables a tus productos.',
  }
}
