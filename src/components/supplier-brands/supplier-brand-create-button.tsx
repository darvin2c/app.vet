'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SupplierBrandCreate } from './supplier-brand-create'

interface SupplierBrandCreateButtonProps {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  supplierId?: string
  brandId?: string
}

export function SupplierBrandCreateButton({
  variant = 'default',
  size = 'default',
  supplierId,
  brandId,
}: SupplierBrandCreateButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant={variant} size={size} onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Asignar Marca
      </Button>

      <SupplierBrandCreate
        open={open}
        onOpenChange={setOpen}
        supplierId={supplierId}
        brandId={brandId}
      />
    </>
  )
}