'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { SupplierCreate } from './supplier-create'

interface SupplierCreateButtonProps {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function SupplierCreateButton({
  variant = 'default',
  size = 'default',
}: SupplierCreateButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton
        variant={variant}
        size={size}
        onClick={() => setOpen(true)}
        icon={Plus}
      >
        Nuevo Proveedor
      </ResponsiveButton>

      <SupplierCreate open={open} onOpenChange={setOpen} />
    </>
  )
}
