'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  ResponsiveButton,
  ResponsiveButtonProps,
} from '@/components/ui/responsive-button'
import { RoleCreate } from './role-create'

export function RoleCreateButton({
  children,
  ...props
}: ResponsiveButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton
        icon={Plus}
        tooltip="Nuevo Rol"
        onClick={() => setOpen(true)}
        {...props}
      >
        {children || 'Nuevo'}
      </ResponsiveButton>

      <RoleCreate open={open} onOpenChange={setOpen} />
    </>
  )
}
