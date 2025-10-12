'use client'

import { ResponsiveButton } from '@/components/ui/responsive-button'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { ProductMovementCreate } from './product-movement-create'

export function ProductMovementCreateButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton icon={Plus} onClick={() => setOpen(true)}>
        Nuevo Movimiento
      </ResponsiveButton>
      <ProductMovementCreate open={open} onOpenChange={setOpen} />
    </>
  )
}
