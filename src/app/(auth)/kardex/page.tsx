'use client'

import PageBase from '@/components/page-base'
import { ProductMovementList } from '@/components/product-movements/product-movement-list'
import { SearchInput } from '@/components/ui/search-input'
import { Filters } from '@/components/ui/filters'
import { ButtonGroup } from '@/components/ui/button-group'
import { OrderBy } from '@/components/ui/order-by'
import { FilterConfig } from '@/components/ui/filters'
import { OrderByConfig } from '@/components/ui/order-by'
import { ProductSelect } from '@/components/products/product-select'
import { ProductMovementCreateButton } from '@/components/product-movements/product-movement-create-button'

export default function KardexPage() {
  // Configuración de filtros específicos para Kardex
  const filters: FilterConfig[] = [
    {
      field: 'product_id',
      label: 'Producto',
      operator: 'eq',
      component: ProductSelect,
    },
    {
      field: 'created_at',
      label: 'Fecha desde',
      placeholder: 'Seleccionar fecha inicial',
      operator: 'gte',
    },
  ]

  const orderByConfig: OrderByConfig = {
    columns: [
      { field: 'created_at', label: 'Fecha', sortable: true },
      { field: 'quantity', label: 'Cantidad', sortable: true },
      { field: 'unit_cost', label: 'Costo Unitario', sortable: true },
    ],
  }

  return (
    <PageBase
      title="Kardex"
      subtitle="Control detallado de movimientos de inventario"
      search={
        <SearchInput
          hasSidebarTriggerLeft
          placeholder="Buscar por referencia o nota..."
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
              <ProductMovementCreateButton variant={'outline'} />
            </>
          }
        />
      }
    >
      <ProductMovementList
        filterConfig={filters}
        orderByConfig={orderByConfig}
      />
    </PageBase>
  )
}
