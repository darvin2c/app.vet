'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { TreatmentCreate } from './treatment-create'

interface TreatmentCreateButtonProps {
  petId?: string
}

export function TreatmentCreateButton({ petId }: TreatmentCreateButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton
        icon={Plus}
        tooltip="Nuevo Tratamiento"
        onClick={() => setOpen(true)}
      >
        Nuevo Tratamiento
      </ResponsiveButton>

      <TreatmentCreate open={open} onOpenChange={setOpen} petId={petId} />
    </>
  )
}
