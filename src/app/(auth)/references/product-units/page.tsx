'use client'

import { ReferencePageLayout } from '@/components/references/reference-page-layout'
import { ProductUnitList } from '@/components/product-units/product-unit-list'
import { SearchInput } from '@/components/ui/search-input'
import { Ruler } from 'lucide-react'

export default function ProductUnitsPage() {
  return (
    <ReferencePageLayout
      title="Unidades de Productos"
      subtitle="Definir unidades de medida para productos del inventario"
      icon={Ruler}
      search={<SearchInput placeholder="Buscar unidades..." />}
    >
      <ProductUnitList />
    </ReferencePageLayout>
  )
}
