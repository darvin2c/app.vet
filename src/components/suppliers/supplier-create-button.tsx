'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { SupplierCreate } from './supplier-create'
import CanAccess from '@/components/ui/can-access'

export function SupplierCreateButton({
  children,
  ...props
}: ResponsiveButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <CanAccess resource="suppliers" action="create">
      <ResponsiveButton
        icon={Plus}
        tooltip="Nuevo Proveedor"
        onClick={() => setOpen(true)}
        {...props}
      >
        {children || 'Nuevo'}
      </ResponsiveButton>

      <SupplierCreate open={open} onOpenChange={setOpen} />
    </CanAccess>
  )
}
