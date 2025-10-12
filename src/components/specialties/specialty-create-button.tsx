'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { SpecialtyCreate } from './specialty-create'

export function SpecialtyCreateButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton
        icon={Plus}
        tooltip="Nueva Especialidad"
        onClick={() => setOpen(true)}
      >
        Nueva Especialidad
      </ResponsiveButton>

      <SpecialtyCreate open={open} onOpenChange={setOpen} />
    </>
  )
}
