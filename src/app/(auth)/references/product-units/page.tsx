'use client'

import PageBase from '@/components/page-base'
import { ProductUnitList } from '@/components/product-units/product-unit-list'
import { SearchInput } from '@/components/ui/search-input'

export default function ProductUnitsPage() {
  return (
    <PageBase
      title="Unidades de Productos"
      subtitle="Definir unidades de medida para productos del inventario"
      search={<SearchInput placeholder="Buscar unidades..." />}
    >
      <ProductUnitList />
    </PageBase>
  )
}
