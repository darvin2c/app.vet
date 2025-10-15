'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { SurgeryCreate } from './surgery-create'

interface SurgeryCreateButtonProps {
  petId: string
}

export function SurgeryCreateButton({ petId }: SurgeryCreateButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton
        size="sm"
        icon={Plus}
        tooltip="Nueva Cirugía"
        onClick={() => setOpen(true)}
      >
        Nueva Cirugía
      </ResponsiveButton>

      <SurgeryCreate open={open} onOpenChange={setOpen} petId={petId} />
    </>
  )
}
