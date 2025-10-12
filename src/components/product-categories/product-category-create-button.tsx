'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { ProductCategoryCreate } from './product-category-create'

export function ProductCategoryCreateButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton
        onClick={() => setOpen(true)}
        icon={Plus}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Crear Categoría
      </ResponsiveButton>
      <ProductCategoryCreate open={open} onOpenChange={setOpen} />
    </>
  )
}