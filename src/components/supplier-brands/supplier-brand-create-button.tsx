'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { SupplierBrandCreate } from './supplier-brand-create'

interface SupplierBrandCreateButtonProps extends ResponsiveButtonProps {
  supplierId?: string
  brandId?: string
}

export function SupplierBrandCreateButton({
  children,
  supplierId,
  brandId,
  ...props
}: SupplierBrandCreateButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton
        icon={Plus}
        onClick={() => setOpen(true)}
        tooltip="Asignar Marca"
        {...props}
      >
        {children || 'Asignar Marca'}
      </ResponsiveButton>

      <SupplierBrandCreate
        open={open}
        onOpenChange={setOpen}
        supplierId={supplierId}
        brandId={brandId}
      />
    </>
  )
}
