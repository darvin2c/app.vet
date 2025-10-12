'use client'

import PageBase from '@/components/page-base'
import { ProductCategoryList } from '@/components/product-categories/product-category-list'
import { SearchInput } from '@/components/ui/search-input'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { ProductCategoryCreate } from '@/components/product-categories/product-category-create'
import { Package, Plus } from 'lucide-react'
import { useState } from 'react'

function ProductCategoryCreateButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton
        icon={Plus}
        tooltip="Nueva Categoría"
        onClick={() => setOpen(true)}
      >
        Nueva Categoría
      </ResponsiveButton>

      <ProductCategoryCreate open={open} onOpenChange={setOpen} />
    </>
  )
}

export default function ProductCategoriesPage() {
  return (
    <PageBase
      title={
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6" />
          Categorías de Productos
        </div>
      }
      subtitle="Organizar productos en categorías para mejor gestión"
      search={<SearchInput placeholder="Buscar categorías..." />}
    >
      <ProductCategoryList />
    </PageBase>
  )
}
