'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { ProcedureCreate } from './procedure-create'

export function ProcedureCreateButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton
        icon={Plus}
        tooltip="Nuevo Procedimiento"
        onClick={() => setOpen(true)}
      >
        Nuevo Procedimiento
      </ResponsiveButton>

      <ProcedureCreate open={open} onOpenChange={setOpen} />
    </>
  )
}
