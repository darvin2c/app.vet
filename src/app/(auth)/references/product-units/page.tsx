'use client'

import PageBase from '@/components/page-base'
import { ProductUnitList } from '@/components/product-units/product-unit-list'
import { SearchInput } from '@/components/ui/search-input'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { ProductUnitCreate } from '@/components/product-units/product-unit-create'
import { Ruler, Plus } from 'lucide-react'
import { useState } from 'react'

function ProductUnitCreateButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton
        icon={Plus}
        tooltip="Nueva Unidad"
        onClick={() => setOpen(true)}
      >
        Nueva Unidad
      </ResponsiveButton>

      <ProductUnitCreate open={open} onOpenChange={setOpen} />
    </>
  )
}

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
