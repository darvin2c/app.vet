'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { ProductCreate } from './product-create'

export function ProductCreateButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton
        icon={Plus}
        tooltip="Nuevo Producto"
        onClick={() => setOpen(true)}
      >
        Nuevo Producto
      </ResponsiveButton>

      <ProductCreate open={open} onOpenChange={setOpen} />
    </>
  )
}
