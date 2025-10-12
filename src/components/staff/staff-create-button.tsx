'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { StaffCreate } from './staff-create'

export function StaffCreateButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton
        icon={Plus}
        tooltip="Nuevo Staff"
        onClick={() => setOpen(true)}
      >
        Nuevo Staff
      </ResponsiveButton>

      <StaffCreate open={open} onOpenChange={setOpen} />
    </>
  )
}
