'use client'

import PageBase from '@/components/page-base'
import { ProductUnitList } from '@/components/product-units/product-unit-list'
import { SearchInput } from '@/components/ui/search-input'
import { Ruler } from 'lucide-react'

export default function ProductUnitsPage() {
  return (
    <PageBase
      title={
        <div className="flex items-center gap-2">
          <Ruler className="h-6 w-6" />
          Unidades de Productos
        </div>
      }
      subtitle="Definir unidades de medida para productos del inventario"
      search={<SearchInput placeholder="Buscar unidades..." />}
    >
      <ProductUnitList />
    </PageBase>
  )
}
