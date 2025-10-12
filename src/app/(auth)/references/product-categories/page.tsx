'use client'

import PageBase from '@/components/page-base'
import { ProductCategoryList } from '@/components/product-categories/product-category-list'
import { ProductCategoryCreateButton } from '@/components/product-categories/product-category-create-button'
import { Package } from 'lucide-react'

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
    >
      <ProductCategoryList />
    </PageBase>
  )
}
